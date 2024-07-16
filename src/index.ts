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
  getTeamsByOrganization,
  getUser,
  getUserById,
  getUsers,
  login,
  updateUser,
} from "./models/user-model";
import { auth } from "./auth";

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

app.post("/login", login);
app.get("/users", getUsers);

app.get("/users/:id", getUserById);
app.post("/users", createUser);

app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.get("/user", auth, async (req: any, res: Response) => {
  try {
    const user = await getUser(req, res);
    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    res.sendStatus(500);
  }
});

app.get("/organizations/:organizationId/teams", getTeamsByOrganization);



app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
