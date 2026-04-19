import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { loginUser, registerUser } from "./auth.services";
import { User } from "../../entities/user.entities"
import { Agent } from "../../entities/agent.entities";
import { StudentProfile } from "../../entities/student-profile.entities";
import { Beneficiary } from "../../entities/beneficiary.entities";
import { PaymentTransaction } from "../../entities/payment-transaction.entities";
import { KYCDocument } from "../../entities/kyc-document.entities";
import { PaymentProof } from "../../entities/payment-proof.entities";

interface AuthRequest extends Request {
  user?: any;
//   file?: Express.Multer.File;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
        });
    }

    // check if user already exists
   
    
    try {
         const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({
        where: { email },
    });

    if (existingUser) {
        return res.status(400).json({
            message: "Email is already registered",
        });
    } 

        const user = await registerUser(email, password);

        return res.status(201).json({
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error); // ✅ send to error middleware
  }
};

export const createAgent = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

  }catch (error) {
    next(error); // ✅ send to error middleware
  }
};

export const createStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
}catch (error) {
    next(error); // ✅ send to error middleware
  }
};

export const createBeneficiary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const beneficiaryRepo = AppDataSource.getRepository(Beneficiary);
        const { 
            beneficiary_type,
            name,
            swift_code,
            bank_name,
            account_number, 
            routing_number,
            contact_email,
            contact_phone,
            address_line1,
            address_line2,
            city,
            province_state,
            country
         } = req.body;

         const beneficiary = new Beneficiary();

        beneficiary.beneficiary_type = beneficiary_type;
        beneficiary.name = name;
        beneficiary.swift_code = swift_code;
        beneficiary.bank_name = bank_name;
        beneficiary.account_number = account_number;
        beneficiary.routing_number = routing_number;
        beneficiary.contact_email = contact_email;
        beneficiary.contact_phone = contact_phone;
        beneficiary.address_line1 = address_line1;
        beneficiary.address_line2 = address_line2;
        beneficiary.city = city;
        beneficiary.province_state = province_state;
        beneficiary.country = country;
        beneficiary.is_active = true;

        await beneficiaryRepo.save(beneficiary);

        return res.status(201).json({
            message: "Beneficiary created successfully",
            data: beneficiary,
        });
    } catch (error) {
        next(error);
    }
}

export const createPaymentTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionRepo = AppDataSource.getRepository(PaymentTransaction);
    const studentRepo = AppDataSource.getRepository(StudentProfile);
    const beneficiaryRepo = AppDataSource.getRepository(Beneficiary);
    const agentRepo = AppDataSource.getRepository(Agent);

    const userId = req.user?.id;

    const agent = await agentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!agent) {
      return res.status(404).json({
        message: "You're not an agent",
      });
    }

    const {
      student_id,
      beneficiary_id,
      cad_amount,
      payment_type,
      local_currency,
      student_number_at_beneficiary,
    } = req.body;

    const student = await studentRepo.findOne({
      where: { student_id },
      relations: ["agent"],
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.agent.agent_id !== agent.agent_id) {
      return res.status(403).json({
        message: "You can only create transactions for your own students",
      });
    }

    const beneficiary = await beneficiaryRepo.findOneBy({ beneficiary_id });

    if (!beneficiary) {
      return res.status(404).json({
        message: "Beneficiary not found",
      });
    }

    const FX_RATE = 1500;
    const SERVICE_FEE_PERCENT = 0.02;

    const localAmount = cad_amount * FX_RATE;
    const serviceFee = localAmount * SERVICE_FEE_PERCENT;
    const totalPayableLocal = localAmount + serviceFee;

    const transaction = new PaymentTransaction();

    transaction.transaction_reference = `TXN-${Date.now()}`;
    transaction.student = student; // ✅ fixed
    transaction.agent = agent;     // ✅ fixed
    transaction.beneficiary = beneficiary;

    transaction.payment_type = payment_type;
    transaction.student_number_at_beneficiary = student_number_at_beneficiary;

    transaction.cad_amount = cad_amount;
    transaction.local_currency = local_currency;

    transaction.local_amount = localAmount;
    transaction.service_fee_amount = serviceFee;
    transaction.total_payable_local = totalPayableLocal;

    transaction.rate_locked_at = new Date();
    transaction.rate_expires_at = new Date(Date.now() + 15 * 60 * 1000);

    transaction.local_transfer_due_at = new Date(
      Date.now() + 48 * 60 * 60 * 1000
    );

    transaction.beneficiary_confirmation_flag = false;
    transaction.status = "pending";

    await transactionRepo.save(transaction); // ✅ VERY IMPORTANT

    return res.status(201).json({
      message: "Payment transaction created successfully",
      data: transaction,
    });

  } catch (error) {
    next(error);
  }
};

export const createkycDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kycRepo = AppDataSource.getRepository(KYCDocument);
    const studentRepo = AppDataSource.getRepository(StudentProfile);

    const userId = req.user?.id;

    // 1. Get student
    const student = await studentRepo.findOne({
  where: { student_id: req.body.student_id },
});
    // const student = await studentRepo.findOne({
    //   where: { id: req.body.student_id },
    // });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // const file = req.file;
    const file = req.file as Express.Multer.File;
    const { document_type } = req.body;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // 2. Create KYC
    const kyc = new KYCDocument();
    kyc.student = student;
    kyc.document_type = document_type;
    kyc.file_path = file.path;
    kyc.file_name = file.originalname;
    kyc.mime_type = file.mimetype;

    await kycRepo.save(kyc);

    return res.status(201).json({
      message: "KYC document uploaded successfully",
      data: kyc,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProof = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const proofRepo = AppDataSource.getRepository(PaymentProof);
    const transactionRepo = AppDataSource.getRepository(PaymentTransaction);

    const { transaction_id } = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
        return res.status(400).json({
            message: "No file uploaded",
        });
    }

    const transaction = await transactionRepo.findOne({
        where: { transaction_id },
        relations: ["student", "agent"],
    });

    if (!transaction) {
        return res.status(404).json({
            message: "Transaction not found",
        });
}

const proof = new PaymentProof();
proof.transaction = transaction;
proof.uploaded_by = transaction.agent.user; 
proof.file_path = file.path;
proof.file_name = file.originalname;
proof.mime_type = file.mimetype;
proof.is_valid = false;
// proof.rejection_reason = "";
// proof.validated_by = null;
// proof.uploaded_at = new Date();
// proof.updated_at = new Date();

await proofRepo.save(proof);

return res.status(201).json({
    message: "Payment proof uploaded successfully",
    data: proof,
 });
} catch (error) {
    next(error);
  }
};