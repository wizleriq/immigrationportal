import "reflect-metadata";
import { User } from "./entities/user.entities";
import { Agent } from "./entities/agent.entities";
import { StudentProfile } from "./entities/student-profile.entities";
import { Beneficiary } from "./entities/beneficiary.entities";
import { PaymentTransaction } from "./entities/payment-transaction.entities";
import { KYCDocument } from "./entities/kyc-document.entities";
import { PaymentProof } from "./entities/payment-proof.entities";
import { DataSource } from "typeorm";
import { StatusHistory } from "./entities/status-history.entities";
import { ForexRateQuote } from "./entities/forex-rate-quote.entities";
import * as dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "cowrisdb",

  // entities: [__dirname + "/entities/*.{ts,js}"],
  entities: [User, Agent, StudentProfile, Beneficiary, PaymentTransaction, KYCDocument, PaymentProof, StatusHistory, ForexRateQuote],

  synchronize: true, // ⚠️ ONLY FOR DEV
  logging: false,
});

export { AppDataSource };
