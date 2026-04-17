import { Router } from "express";
import { register, login } from "../services/auth/auth.controller";
// import { register, login } from "../services/auth/auth.controller"; 

const router = Router();

router.post("/register", register);
router.post("/login", login);

// // your routes here
// router.post("/login", ...);
// // ...

export default router;   // ES‑module default export