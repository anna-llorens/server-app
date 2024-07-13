import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { checkDbConnection } from "./helpers";
import {
  getNodes,
  createNode,
  deleteNode,
  updateNode,
} from "./models/node-model";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  loginUser,
} from "./models/user-model";

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

checkDbConnection();

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

app.post("/auth/login", loginUser);
app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
