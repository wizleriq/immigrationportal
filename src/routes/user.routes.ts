import  express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entities";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    try {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        // Create new user
        const user =  userRepository.create({ email, password_hash: password,});
        await userRepository.save(user);

        return res.status(201).json({
            message: "User registered successfully",
            data: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("Registeration error", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }   
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({ where: { email } });
        if (!user || user.password_hash !== password) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            data: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
    

export default router;