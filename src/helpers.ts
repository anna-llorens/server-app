import { pool } from "./config";

export const checkDbConnection = async () => {
  try {
    await pool.connect();
    console.info(`Connected to: ${process.env.PGDATABASE}`);
    return true;
  } catch (err) {
    console.error("Database connection error", err);
    return false;
  }
};
