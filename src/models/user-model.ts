import { Request, Response } from "express";
import { pool } from "../config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const createToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("base64"));
      }
    });
  });
};

const getUserByToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE token = $1",
      [token],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]);
        }
      }
    );
  });
};

export const getUsers = (request: Request, response: Response): void => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

export const getUserById = (request: Request, response?: Response): void => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response?.status(200).json(results.rows);
  });
};
export const getUser = (request: any): Promise<any> => {
  const id = parseInt(request?.user?.id);

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.rows.length === 0) {
        return resolve(null);
      }
      resolve(results.rows[0]);
    });
  });
};

export const createUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { name, email, password, role: userRole } = request.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const role = userRole ?? "user";
  const token = await createToken();

  pool.query(
    "INSERT INTO users (name, email, password, role, token) VALUES ($1, $2, $3, $4, $5)",
    [name, email, hashedPassword, role, token],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error adding user: ${error.message}`);
        return;
      }
      response.status(201).send(`User added with default role 'user'`);
    }
  );
};

export const updateUser = (request: Request, response: Response): void => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

export const deleteUser = (request: Request, response: Response): void => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

export const loginUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, password } = request.body;

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    async (error, results) => {
      if (error) {
        response.status(500).send(`Error fetching user: ${error.message}`);
        return;
      }

      if (results.rows.length > 0) {
        const user = results.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          try {
            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
              expiresIn: "1h",
            });

            response.status(200).json({ user, token });
          } catch (tokenError) {
            response.status(500).send(`Error creating token: ${tokenError}`);
          }
        } else {
          response.status(401).send("Invalid password");
        }
      } else {
        response.status(404).send("User not found");
      }
    }
  );
};

export const getMe = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).send("Authorization header missing");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await getUserByToken(token);
    if (!user) {
      response.status(404).send("User not found");
      return;
    }
    response.status(200).json(user);
  } catch (error) {
    response.status(500).send(`Error fetching user: ${error}`);
  }
};
