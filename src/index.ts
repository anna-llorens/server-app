import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const port = 6000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT as string, 10), // Convert port to number
});

pool.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

app.get("/api/data", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM your_table");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
