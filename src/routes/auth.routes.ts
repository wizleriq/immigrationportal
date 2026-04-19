import { Router } from "express";
import { register, login, createAgent, createStudentProfile, createBeneficiary, createPaymentTransaction } from "../services/auth/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
// import { register, login } from "../services/auth/auth.controller"; 

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/become-agent", authMiddleware, createAgent);
router.post("/student", authMiddleware, createStudentProfile);
router.post("/beneficiary", authMiddleware, createBeneficiary);
router.post("transaction", authMiddleware, createPaymentTransaction);


// // your routes here
// router.post("/login", ...);
// // ...

export default router;   // ES‑module default export