import { pool } from "../config";

interface Node {
  name: string;
  type: string;
}

const getNodes = async (): Promise<any> => {
  try {
    const results = await pool.query("SELECT * FROM nodes;");
    return results.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch nodes");
  }
};

const createNode = async (node: Node): Promise<string> => {
  const { name, type } = node;
  try {
    const results = await pool.query(
      "INSERT INTO nodes (name, type) VALUES ($1, $2) RETURNING *",
      [name, type]
    );

    return JSON.stringify(results.rows[0]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create node");
  }
};

const deleteNode = async (id: string): Promise<string> => {
  try {
    await pool.query("DELETE FROM nodes WHERE id = $1", [id]);
    return `Node deleted with ID: ${id}`;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete node");
  }
};

const updateNode = async (id: string, node: Partial<Node>): Promise<string> => {
  const { name, type } = node;
  try {
    const results = await pool.query(
      "UPDATE nodes SET name = $1, type = $2 WHERE id = $3 RETURNING *",
      [name, type, id]
    );
    return JSON.stringify(results.rows[0]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update node");
  }
};

export { getNodes, createNode, deleteNode, updateNode };
