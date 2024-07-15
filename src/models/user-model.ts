import { Request, Response } from "express";
import { pool } from "../config";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const getUsers = (request: Request, response: Response): void => {
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());

  console.log("getUsers -->", request.params);
  const query = `
    SELECT 
      users.id as user_id, users.name as user_name, users.email, users.role,
      teams.id as team_id, teams.name as team_name,
      organizations.id as organization_id, organizations.name as organization_name
    FROM users
    LEFT JOIN teams ON users.teamId = teams.id
    LEFT JOIN organizations ON users.organizationId = organizations.id
    ORDER BY users.id ASC
  `;

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }

    const users = results.rows.map((row) => ({
      id: row.user_id,
      name: row.user_name,
      email: row.email,
      role: row.role,
      team: row.team_id ? { id: row.team_id, name: row.team_name } : null,
      organization: row.organization_id
        ? { id: row.organization_id, name: row.organization_name }
        : null,
    }));

    response.status(200).json(users);
  });
};

export const getUserById = (request: Request, response?: Response): void => {
  const id = parseInt(request.params.id);
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());

  console.log("getUserById -->", id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response?.status(200).json(results.rows);
  });
};
export const getUser = async (request: any, res: Response): Promise<any> => {
  const id = parseInt(request?.user?.id);

  console.info(new Date().toISOString(), "/user", "getUser", "userId:", id);

  const query = `
    SELECT 
      users.name as user_name, users.email, users.role,
      teams.id as team_id, teams.name as team_name,
      organizations.id as organization_id, organizations.name as organization_name
    FROM users
    LEFT JOIN teams ON users.teamId = teams.id
    LEFT JOIN organizations ON users.organizationId = organizations.id
    WHERE users.id = $1
  `;

  try {
    const results = await pool.query(query, [id]);
    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows[0];

    const user = {
      name: row.user_name,
      email: row.email,
      id,
      role: row.role,
      team: row.team_id ? { id: row.team_id, name: row.team_name } : null,
      organization: row.organization_id
        ? { id: row.organization_id, name: row.organization_name }
        : null,
    };

    return user;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    res.status(500).send(`Error adding user: ${error}`);
  }
};

export const createUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { name, email, password, role: userRole } = request.body;
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());
  console.log("createUser -->", name, email, password, userRole);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const role = userRole ?? "user";

  pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, hashedPassword, role],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error adding user: ${error.message}`);
        return;
      }
      response.status(201).send(`User added with default role 'user'`);
    }
  );
};

export const updateUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const id = parseInt(request.params.id);
  const { name, email, password } = request.body;
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());

  console.log("updateUser -->", id, name, email, password);

  // If password is provided, hash it
  let hashedPassword;
  if (password) {
    const saltRounds = 10;

    hashedPassword = await bcrypt.hash(password, saltRounds);
  }

  // Prepare SQL query and parameters
  let query = "UPDATE users SET name = $1, email = $2";
  const params = [name, email];

  if (hashedPassword) {
    query += ", password = $3 WHERE id = $4";
    params.push(hashedPassword, id);
    console.log("Updating password for user with ID: ", id);
  } else {
    query += " WHERE id = $3";
    params.push(id);
  }

  // Execute SQL query
  pool.query(query, params, (error, results) => {
    if (error) {
      response.status(500).send(`Error updating user: ${error.message}`);
      return;
    }
    response.status(200).send(`User modified with ID: ${id}`);
  });
};

export const deleteUser = (request: Request, response: Response): void => {
  const id = parseInt(request.params.id);
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());
  console.log("deleteUser -->", id, "request.params.id");

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

export const login = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, password } = request.body;
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());

  console.info("Endpoint: /login");
  console.info("login -->", email, password);
  console.info("---------------------------------------------");
  console.info("Timestamp:", new Date().toISOString());

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

            const { password, ...userData } = user;

            response.status(200).json({ user: userData, token });
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
