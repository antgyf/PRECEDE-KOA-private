import api from "./api";

export interface Assessment {
  patientid: number;
  term: number;
}

export async function getAnalysisExpiry(assessment: Assessment, signal: AbortSignal) {
  const { data } = await api.get<{ expiresAt: number | null }>("/analysis/access", {
    params: assessment,
    signal,
    timeout: 10_000,
  });
  return typeof data.expiresAt === "number" && data.expiresAt > Date.now()
    ? data.expiresAt
    : null;
}
