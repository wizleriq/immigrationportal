import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "cowrisdb",

  entities: [__dirname + "/entities/*.{ts,js}"],

  synchronize: true, // ⚠️ ONLY FOR DEV
  logging: false,
});

export { AppDataSource };
