import { Request, Response } from "express";
import { pool } from "../config";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export const getUsers = (request: Request, response: Response): void => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

export const getUserById = (request: Request, response: Response): void => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

import { QueryResult } from "pg";

export const createUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { name, email, password } = request.body;

  // Hash the password before storing it
  const saltRounds = 10; // It's a good practice to make this configurable
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashedPassword],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error adding user: ${error.message}`);
        return;
      }
      // Assuming your DB setup does not automatically return the insertId, adjust accordingly.
      response.status(201).send(`User added`);
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
            const token = await createToken();
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
