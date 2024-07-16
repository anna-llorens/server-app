import { pool } from "../config";

type Node = {
  name?: string;
  type?: string;
  description?: string;
};

const getNodes = async (): Promise<any> => {
  console.info(new Date().toISOString(), "/nodes", "getNodes");

  try {
    const results = await pool.query("SELECT * FROM nodes;");
    return results.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch nodes");
  }
};

const createNode = async (node: Node): Promise<string> => {
  const { name, type, description } = node;
  console.info(
    new Date().toISOString(),
    "/nodes",
    "createNode",
    "name:",
    name,
    "type:",
    type
  );
  try {
    const results = await pool.query(
      "INSERT INTO nodes (name, type, description) VALUES ($1, $2, $3) RETURNING *",
      [name, type, description]
    );

    return JSON.stringify(results.rows[0]);
  } catch (error: any) {
    console.error("Database error:", error);
    if (error.message.includes("invalid input value")) {
      throw { status: 500, message: `Invalid input value for type: ${type}` };
    }
    throw { status: 500, message: "Failed to create node" };
  }
};

const deleteNode = async (id: string): Promise<string> => {
  console.info(new Date().toISOString(), "/nodes/:id", "deleteNode", id);

  try {
    await pool.query("DELETE FROM nodes WHERE id = $1", [id]);
    return `Node deleted with ID: ${id}`;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete node");
  }
};

const updateNode = async (id: string, node: Partial<Node>): Promise<string> => {
  console.info(new Date().toISOString(), "/nodes/:id", "updateNode", id);
  const { name, type, description } = node;
  try {
    const results = await pool.query(
      "UPDATE nodes SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, type, description, id]
    );
    return JSON.stringify(results.rows[0]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update node");
  }
};

export { getNodes, createNode, deleteNode, updateNode };
