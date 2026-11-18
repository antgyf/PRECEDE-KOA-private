import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import { Router, type Request, type RequestHandler, type Response } from "express";
import jwt from "jsonwebtoken";
import pool from "./database.mts";

const router = Router();
const cookieName = "analysisAccess";
const audience = "precede-analysis";
const accessSeconds = 15 * 60;

function isValidAssessment(patientid: unknown, term: unknown) {
  return typeof patientid === "number" && Number.isSafeInteger(patientid) && patientid > 0
    && typeof term === "number" && Number.isSafeInteger(term) && term >= 0;
}

function getSession(req: Request) {
  const token = req.cookies?.token;
  const secret = process.env.JWT_SECRET;
  if (typeof token !== "string" || !secret) return;

  try {
    const claims = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (typeof claims === "string" || !Number.isSafeInteger(claims.id)
      || typeof claims.username !== "string" || typeof claims.exp !== "number") return;

    return {
      secret,
      expiresAt: claims.exp,
      accountKey: JSON.stringify([claims.id, claims.username]),
      binding: createHash("sha256").update(token).digest("hex"),
    };
  } catch {
    return;
  }
}

function getExpiry(req: Request, session: NonNullable<ReturnType<typeof getSession>>, patientid: number, term: number) {
  const token = req.cookies?.[cookieName];
  if (typeof token !== "string") return null;

  try {
    const claims = jwt.verify(token, session.secret, { audience, algorithms: ["HS256"] });
    if (typeof claims !== "string" && claims.session === session.binding
      && claims.patientid === patientid && claims.term === term && typeof claims.exp === "number") {
      return claims.exp * 1000;
    }
  } catch {
    // An expired or invalid grant requires a fresh password check.
  }
  return null;
}

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

router.get("/access", (req, res) => {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ message: "Staff sign-in required." });
    return;
  }

  const patientid = Number(req.query.patientid);
  const term = req.query.term === undefined ? NaN : Number(req.query.term);
  if (!isValidAssessment(patientid, term)) {
    res.status(400).json({ message: "Invalid assessment." });
    return;
  }

  res.json({ expiresAt: getExpiry(req, session, patientid, term) });
});

router.post("/access", async (req, res) => {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ message: "Staff sign-in required." });
    return;
  }

  const { patientid, term, password } = req.body ?? {};
  if (!isValidAssessment(patientid, term) || typeof password !== "string"
    || password.length === 0 || Buffer.byteLength(password, "utf8") > 72) {
    res.status(400).json({ message: "Invalid assessment or password." });
    return;
  }

  const existingExpiry = getExpiry(req, session, patientid, term);
  if (existingExpiry !== null) {
    res.json({ expiresAt: existingExpiry });
    return;
  }

  const hash = process.env.ANALYSIS_PASSWORD_HASH;
  if (!hash) {
    res.status(503).json({ message: "The analysis password is not configured." });
    return;
  }

  try {
    // Reserve an attempt atomically across all function instances.
    const result = await pool.query(
      `INSERT INTO analysis_password_attempt (account_key, window_start, attempts)
       VALUES ($1, CURRENT_TIMESTAMP, 1)
       ON CONFLICT (account_key) DO UPDATE
       SET attempts = CASE
             WHEN analysis_password_attempt.window_start <= CURRENT_TIMESTAMP - INTERVAL '15 minutes' THEN 1
             ELSE analysis_password_attempt.attempts + 1
           END,
           window_start = CASE
             WHEN analysis_password_attempt.window_start <= CURRENT_TIMESTAMP - INTERVAL '15 minutes' THEN CURRENT_TIMESTAMP
             ELSE analysis_password_attempt.window_start
           END
       WHERE analysis_password_attempt.attempts < 5
          OR analysis_password_attempt.window_start <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
       RETURNING attempts`,
      [session.accountKey]
    );
    if (result.rowCount === 0) {
      res.status(429).set("Retry-After", String(accessSeconds))
        .json({ message: "Too many password attempts. Try again later." });
      return;
    }
    if (!(await bcrypt.compare(password, hash))) {
      res.status(403).json({ message: "Incorrect analysis password." });
      return;
    }
    await pool.query("DELETE FROM analysis_password_attempt WHERE account_key = $1", [session.accountKey]);

    const issuedAt = Math.floor(Date.now() / 1000);
    const expires = Math.min(issuedAt + accessSeconds, session.expiresAt);
    if (expires <= issuedAt) {
      res.status(401).json({ message: "Staff sign-in required." });
      return;
    }

    const grant = jwt.sign({ session: session.binding, patientid, term, exp: expires }, session.secret, { audience });
    res.cookie(cookieName, grant, { ...cookieOptions(), maxAge: (expires - issuedAt) * 1000 });
    res.json({ expiresAt: expires * 1000 });
  } catch (error) {
    console.error("Failed to verify analysis access:", error);
    res.status(503).json({ message: "Analysis access is temporarily unavailable." });
  }
});

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/.netlify/functions/api",
  };
}

export function clearAnalysisAccess(res: Response) {
  res.clearCookie(cookieName, cookieOptions());
}

export const requireAnalysisAccess: RequestHandler = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ message: "Staff sign-in required." });
    return;
  }

  const patientid = req.body?.patient?.patientid;
  const term = req.body?.assessmentTerm;
  if (!isValidAssessment(patientid, term) || getExpiry(req, session, patientid, term) === null) {
    res.status(403).json({ message: "Unlock the analysis for this assessment first." });
    return;
  }

  next();
};

export { router as analysisAccessRoutes };
