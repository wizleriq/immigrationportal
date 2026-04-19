import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import "reflect-metadata";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to the Cowris API!");
})
export default app;
