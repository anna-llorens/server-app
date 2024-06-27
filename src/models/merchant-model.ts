import { pool } from "..";
import { QueryResult } from "pg"; // Assuming you're using pg

type Merchant = {
  name: string;
  email: string;
}

const getMerchants = async (): Promise<QueryResult["rows"]> => {
  try {
    const results = await pool.query("SELECT * FROM merchants");
    return results.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const createMerchant = async (body: Merchant): Promise<string> => {
  const { name, email } = body;
  try {
    const results = await pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    return `A new merchant has been added: ${JSON.stringify(results.rows[0])}`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const deleteMerchant = async (id: string): Promise<string> => {
  try {
    await pool.query("DELETE FROM merchants WHERE id = $1", [id]);
    return `Merchant deleted with ID: ${id}`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const updateMerchant = async (id: string, body: Merchant): Promise<string> => {
  const { name, email } = body;
  try {
    const results = await pool.query(
      "UPDATE merchants SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    return `Merchant updated: ${JSON.stringify(results.rows[0])}`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { getMerchants, createMerchant, deleteMerchant, updateMerchant };
