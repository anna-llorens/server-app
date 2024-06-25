import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 6000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "yourusername",
  host: "localhost",
  database: "yourdatabase",
  password: "yourpassword",
  port: 5432,
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
