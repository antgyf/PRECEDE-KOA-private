import request from "supertest";
import app from "../api.mts"; // Adjust path as needed

describe("API Integration", () => {
  test("GET /api/patient should return Patient route", async () => {
    const res = await request(app).get("/api/");
    expect(res.status).toBe(200);
    expect(res.text).toBe('{"message":"Allo! Catch-all route."}');
  });
});
