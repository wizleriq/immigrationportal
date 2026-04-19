// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
   console.error("ERROR:", err);
  res.status(err.status || 500).json({ code: err.status || 500, message: err.message || "Server error" });
}
