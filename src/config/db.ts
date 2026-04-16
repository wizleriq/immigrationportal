import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool ({
    host: process.env.DB_Host || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "cowrisdb",
})