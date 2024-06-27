import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  createMerchant,
  deleteMerchant,
  getMerchants,
  updateMerchant,
} from "./models/merchant-model";
import {
  createNode,
  deleteNode,
  getNodes,
  updateNode,
} from "./models/node-model";

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const port = 3001;

// Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

// Database connection configuration
export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT as string, 10),
});

pool.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.info(`Connected to: ${process.env.PGDATABASE}`);
  }
});

// app.get("/", (req, res) => {
//   res.status(200).send("DB server running");
// });

// Get nodes
app.get("/nodes", async (req, res) => {
  try {
    const response = await getNodes();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/nodes", async (req, res) => {
  try {
    const response = await createNode(req.body);
    res.status(200).send(response);
  } catch (error) {
    res.status(200).send("DB server running");
    res.status(500).send(error);
  }
});

app.delete("/nodes/:id", async (req, res) => {
  try {
    const response = await deleteNode(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/nodes/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const body = req.body;
  try {
    const response = await updateNode(id, body);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get merchants

app.get("/", async (req, res) => {
  try {
    const response = await getMerchants();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/merchants", async (req, res) => {
  try {
    const response = await createMerchant(req.body);
    res.status(200).send(response);
  } catch (error) {
    res.status(200).send("DB server running");
    res.status(500).send(error);
  }
});

app.delete("/merchants/:id", async (req, res) => {
  try {
    const response = await deleteMerchant(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put(
  "/merchants/:id",
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;
    try {
      const response = await updateMerchant(id, body);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
