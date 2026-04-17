import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { loginUser, registerUser } from "./auth.services";
import { User } from "../../entities/user.entities"
import { Agent } from "../../entities/agent.entities";

interface AuthRequest extends Request {
  user?: any;
}

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

export const createAgent = async (req: AuthRequest, res: Response) => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const agentRepo = AppDataSource.getRepository(Agent)

        const userId = req.user.id

        const user = await userRepo.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const existingAgent = await agentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (existingAgent) {
        return res.status(400).json({
            message: "Agent already exists for this user",
        });
    }

       const {
      name,
      contact_person,
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state_region,
      country,
    } = req.body;    

    const agent = new Agent();
    agent.user = user;
    agent.name = name;
    agent.contact_person = contact_person;
    agent.contact_number = phone_number;
    agent.email = email;
    agent.address_line1 = address_line1;
    agent.address_line2 = address_line2;
    agent.city = city;
    agent.state_origin = state_region;
    agent.country = country;

    agent.code = `AGENT-${Date.now()}`;
    
    await agentRepo.save(agent);
    
    return res.status(201).json({
    message: "Agent created successfully",
    data: agent,
});
} catch (error) {
    return res.status(500).json({ message: "Server error" });
}
}




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

