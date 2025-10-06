import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB Config:", {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
pool.on("connect", () => console.log("Successfully connected to database!"));
pool.on("error", (err) => {
  console.log("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;

// At the bottom of your database.mts file (after export default pool)
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to database!");

    // Optional: run a simple query to confirm
    const res = await client.query("SELECT NOW()");
    console.log("Database time:", res.rows[0]);

    client.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();
