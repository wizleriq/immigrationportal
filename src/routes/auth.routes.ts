import { Router } from "express";
import { register, login, createAgent, createStudentProfile, createBeneficiary, createPaymentTransaction, createkycDocument, uploadPaymentProof } from "../services/auth/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
// import { register, login } from "../services/auth/auth.controller"; 

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/become-agent", authMiddleware, createAgent);
router.post("/student", authMiddleware, createStudentProfile);
router.post("/beneficiary", authMiddleware, createBeneficiary);
router.post("/transaction", authMiddleware, createPaymentTransaction);
router.post("/kyc-document", authMiddleware, createkycDocument);
router.post("/payment-proof", authMiddleware, uploadPaymentProof);

// // your routes here
// router.post("/login", ...);
// // ...

export default router;   // ES‑module default export