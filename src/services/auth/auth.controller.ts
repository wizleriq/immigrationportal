import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { loginUser, registerUser } from "./auth.services";
import { User } from "../../entities/user.entities"
import { Agent } from "../../entities/agent.entities";
import { StudentProfile } from "../../entities/student-profile.entities";

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
     console.log("REQ.USER:", req.user); 

    const userRepo = AppDataSource.getRepository(User);
    const agentRepo = AppDataSource.getRepository(Agent);

    const userId = req.user?.id;

    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingAgent = await agentRepo.findOne({
      where: { user: user },
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
      state_origin,
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
    agent.state_origin = state_origin;
    agent.country = country;

    agent.code = `AGENT-${Date.now()}`;
    agent.commission_percent = 0;
    agent.is_active = true;

    await agentRepo.save(agent);

    return res.status(201).json({
      message: "Agent created successfully",
      data: agent,
    });

  } catch (error) {   // ✅ NOW CORRECT
    console.error("CREATE AGENT ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createStudentProfile = async (req: AuthRequest, res: Response) => {
    try {
        const agentRepo = AppDataSource.getRepository(Agent);
        const studentRepo = AppDataSource.getRepository(StudentProfile);

        const userId = req.user?.id;
        const agent = await agentRepo.findOne({
            where: { user: { id: userId } },
            relations: ["user"],
        });

        if (!agent)
            return res.status(404).json({
        message: "You're not an agent",
        });

    const {
        full_name,
        phone_number,
        address_line1,
        address_line2,  
        city,
        state_origin,
        country,
        date_of_birth,
    } = req.body;

    const studentProfile =new StudentProfile();
    studentProfile.agent = agent;
    studentProfile.full_name = full_name;
    studentProfile.phone_number = phone_number;
    studentProfile.address_line1 = address_line1;
    studentProfile.address_line2 = address_line2;
    studentProfile.city = city;
    studentProfile.state_origin = state_origin;
    studentProfile.country = country;
    studentProfile.date_of_birth = date_of_birth;   
    
    await studentRepo.save(studentProfile);

    return res.status(201).json({
        message: "Student Created successfully",
        data: studentProfile,
    });
} catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    console.log("USER ID:", req.user?.id);
console.log("AGENT:", Agent);

    return res.status(500).json({
        message: "Server error",
        error: error instanceof Error ? error.message : error,
    });
}}



// export const createAgent = async (req: AuthRequest, res: Response) => {
//     try {
//         const userRepo = AppDataSource.getRepository(User);
//         const agentRepo = AppDataSource.getRepository(Agent)

//         const userId = req.user?.id;

//         const user = await userRepo.findOneBy({ id: userId });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }

//         const existingAgent = await agentRepo.findOne({
//   where: { user: user },
// });
        
//     //     const existingAgent = await agentRepo.findOne({
//     //   where: { user: { id: userId } },
//     //   relations: ["user"],
//     // });

//     if (existingAgent) {
//         return res.status(400).json({
//             message: "Agent already exists for this user",
//         });
//     }

//        const {
//       name,
//       contact_person,
//       email,
//       phone_number,
//       address_line1,
//       address_line2,
//       city,
//       state_origin,
//       country,
//     } = req.body;    

//     const agent = new Agent();
//     agent.user = user;
//     agent.name = name;
//     agent.contact_person = contact_person;
//     agent.contact_number = phone_number;
//     agent.email = email;
//     agent.address_line1 = address_line1;
//     agent.address_line2 = address_line2;
//     agent.city = city;
//     agent.state_origin = state_origin;
//     agent.country = country;

//     agent.code = `AGENT-${Date.now()}`;

//     agent.commission_percent = 0;
//     agent.is_active = true;
    
//     await agentRepo.save(agent);
    
//     return res.status(201).json({
//     message: "Agent created successfully",
//     data: agent,
// });
// } catch (error) {
//     console.error("CREATE AGENT ERROR:", error);

//     return res.status(500).json({
//         message: "Server error",
//         error: error instanceof Error ? error.message : error,
//     });
// }}

// } catch (error) {
//     return res.status(500).json({ message: "Server error" });
// }
// }





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

