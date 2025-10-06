import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "./database.mts";
import cors from "cors";
import jwt from "jsonwebtoken";

const router = Router();

const allowedOrigins = [
  "http://localhost:5173",
  "https://precedekoa.netlify.app",
];

router.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



// Get available surgeon IDs (without accounts)
router.get("/available-ids", async (req: Request, res: Response): Promise<void> => {
    const { Client } = require('pg');

  // Validate environment variables
  const requiredEnvVars = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME || 'postgres',
    DB_PORT: process.env.DB_PORT || '5432'
  };

  // Check for missing required variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value && key !== 'DB_NAME')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    res.status(500).json({
      error: 'Server configuration error',
      details: `Missing environment variables: ${missingVars.join(', ')}`
    });
    return;
  }

  console.log('🔧 DB Connection Details:', {
    host: requiredEnvVars.DB_HOST,
    user: requiredEnvVars.DB_USER,
    database: requiredEnvVars.DB_NAME,
    port: requiredEnvVars.DB_PORT,
    hasPassword: !!requiredEnvVars.DB_PASSWORD,
    passwordLength: requiredEnvVars.DB_PASSWORD ? requiredEnvVars.DB_PASSWORD.length : 0
  });

  const client = new Client({
    host: requiredEnvVars.DB_HOST as string,
    port: parseInt(requiredEnvVars.DB_PORT as string),
    user: requiredEnvVars.DB_USER as string,
    password: requiredEnvVars.DB_PASSWORD as string,
    database: requiredEnvVars.DB_NAME as string,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    console.log('🔄 Attempting database connection...');
    await client.connect();
    console.log('✅ Database connected successfully!');
    
    const result = await client.query('SELECT id FROM surgeons');
    console.log(`✅ Query successful, found ${result.rows.length} rows`);
    
    await client.end();
    
    res.json(result.rows);
    
  } catch (error: unknown) {
    // Type guard to check if it's an Error object
    if (error instanceof Error) {
      console.error('❌ Database error:', {
        code: (error as any).code, // PostgreSQL error code
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        error: 'Database connection failed',
        code: (error as any).code,
        details: error.message
      });
    } else {
      // Handle non-Error objects
      console.error('❌ Unknown error type:', error);
      res.status(500).json({
        error: 'Database connection failed',
        details: 'An unknown error occurred'
      });
    }
  }
});

// Create a surgeon account
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  const { surgeonid, username, password } = req.body;

  if (!username || !password || !surgeonid) {
    res.status(400).json({ message: "Surgeon ID, username, and password are required" });
    return;
  }

  try {
    // Check if username already exists
    const existingUser = await pool.query(
      "SELECT username FROM surgeon WHERE username = $1",
      [username]
    );
    if (existingUser.rows.length > 0) {
      res.status(409).json({ message: "Username is already taken" });
      return;
    }

    // Check if surgeonid exists
    const existingSurgeon = await pool.query(
      "SELECT surgeonid, username FROM surgeon WHERE surgeonid = $1",
      [surgeonid]
    );

    if (existingSurgeon.rows.length === 0) {
      res.status(404).json({ message: "Surgeon ID not found" });
      return;
    }

    if (existingSurgeon.rows[0].username) {
      res.status(409).json({ message: "This surgeon ID already has an account" });
      return;
    }

    // Update existing surgeon with username/password
    const hashedPassword = await bcrypt.hash(password, 10);
    const surgeonRecord = await pool.query(
      "UPDATE surgeon SET username = $1, password = $2 WHERE surgeonid = $3 RETURNING surgeonid",
      [username, hashedPassword, surgeonid]
    );

    res.status(201).json({
      message: "Surgeon account created successfully",
      surgeonid: surgeonRecord.rows[0].surgeonid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Login a surgeon
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    // Query the database for the surgeon by username
    const result = await pool.query(
      "SELECT * FROM surgeon WHERE username = $1",
      [username]
    );

    // Check if surgeon exists
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const surgeon = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, surgeon.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Ensure JWT secret exists
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set!");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { id: surgeon.surgeonid, username: surgeon.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      surgeon: {
        id: surgeon.surgeonid,
        username: surgeon.username,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});


router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// GET surgeon details by ID
router.get("/:surgeonid", async (req: Request, res: Response) => {
  const { surgeonid } = req.params;

  try {
    const result = await pool.query(
      "SELECT surgeonid, surgeontitle FROM surgeon WHERE surgeonid = $1",
      [surgeonid]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Surgeon not found" });
      return;
    }

    res.json(result.rows[0]); // { surgeonid: ..., surgeontitle: ... }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router };
