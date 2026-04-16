import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.services";

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    try {
        const user = await registerUser(email, password);

        return res.status(201).json({
            message: "User registered successfully",
            data: user,
        });
    } catch (error: any) {
        console.error("Registration error:", error.message);

        return res.status(400).json({
            message: error.message || "Registration failed",
        });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    try {
        const user = await loginUser(email, password);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            data: user,
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};





// import { Request, Response } from "express";
// import { loginUser, registerUser} from "./auth.services";


// export const register = async (req: Request, res: Response) => {
//     const {email, password} = req.body;
//     try {
//         const user = await registerUser(email, password);
//         res.status(201).json({message: "User registered successfully", user});
//     } catch (error) {
//         console.error("Registeration error", error);
//         res.status(500).json({message: "Internal server error"});
//     }
// };



// export const login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try { 
//         const user = await loginUser(email, password);
//         if (!user!) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }
//         res.status(200).json({ message: "login successful", user });  
//     }
//     catch (error) {
//         console.error("Login error", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

