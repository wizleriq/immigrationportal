import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
   const query =
  "INSERT INTO users (email, password_hash, user_type, is_verified, verification_token, verification_token_expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email";

// const values = [
//   email,
//   hashedPassword,
//   "user",
//   false,
//   code,
//   expires,
// ];
const values = [
  email.trim().toLocaleLowerCase(),
  hashedPassword,
  "user",
  false,
  code,
  expires,
];
    const result = await pool.query(query, values);

    //send email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Verify your email",
        html: ` Your Verification code is ${code}`,
    });

    return result.rows[0];
};

// export const verifyEmail = async (email: string, code: string) => {
//     const query = "SELECT * FROM users WHERE email = $1 AND verification_code = $2";
//     const values = [email, code];
//     const result = await pool.query(
//         "SELECT * FROM users WHERE email = $1",
//         [email]
//     );

//     const user = result.rows[0];

//     if (!user) {
//         throw new Error("User not found");
//     }

//     if (user.is_verified) {
//         throw new Error("User already verified" )
//    }

//    if (new Date(user.verification_token_expires_at) < new Date()) {
//     throw new Error("Verification code expired");
//    }

//    if (user.verification_token !== code) {
//     throw new Error("Invalid verification code");
//    }

//    await pool.query(
//     "UPDATE users SET is_verified = true WHERE email = $1",
//     [email]
//    );

//    if (!user) {
//     throw new Error("User not found"
//     );
//    }

// //    return result.status(200).json(
// //     "Email verified successfully"

// }

export const verifyEmail = async (email: string, code: string) => {
    console.log("EMAIL FROM FRONTEND:", email);
    console.log("CODE FROM FRONTEND:", code);
    // const result = await pool.query(
    //     "SELECT * FROM users WHERE email = $1",
    //     [email]
    // );
    email = email.trim().toLowerCase();
    
     const result = await pool.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email]
    );

    const user = result.rows[0];

    if (!user) throw new Error("User not found");

    if (user.is_verified) throw new Error("User already verified");

    if (new Date(user.verification_token_expires_at) < new Date()) {
        throw new Error("Verification code expired");
    }

    if (user.verification_token !== code) {
        throw new Error("Invalid verification code");
    }

    await pool.query(
        "UPDATE users SET is_verified = true WHERE email = $1",
        [email]
    );

    return { message: "Email verified successfully" };
};


export const loginUser = async (email: string, password: string) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    const user = result.rows[0];

    if (!user.is_verified) {
        throw new Error("User not verified");

    }
    
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return null;

    // 🔥 CREATE TOKEN
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        id: user.id,
        email: user.email,
        token,
    };
};


// import { pool } from "../../config/db";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// const JWT_SECRET = process.env.JWT_SECRET || "secret";

// export const registerUser = async (email: string, password: string) => {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const query = "INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id, email";
//     const values = [email, hashedPassword, "user"];
//     const result = await pool.query(query, values);
//     return result.rows[0];
// };


// export const loginUser = async (email: string, password: string) => {
//     const query = "SELECT * FROM users WHERE email = $1";
//     const result = await pool.query(query, [email]);

//     const user = result.rows[0];

//     if (!user) return null;

//     const isMatch = await bcrypt.compare(password, user.password_hash);

//     if (!isMatch) return null;

//     // 🔥 CREATE TOKEN
//     const token = jwt.sign(
//         {
//             id: user.id,
//             email: user.email,
//         },
//         JWT_SECRET,
//         { expiresIn: "1d" }
//     );

//     return {
//         id: user.id,
//         email: user.email,
//         token,
//     };
// };


// import { pool } from "../../config/db";
// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";

// export const registerUser = async (email: string, password: string) => {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();

//     const query = "INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING id, email";
//     const values = [userId, email, hashedPassword];

//     const result = await pool.query(query, values);
//     return result.rows[0];
// };

// export const loginUser = async (email: string, password: string) => {
//     const query = "SELECT * FROM users WHERE email = $1";
//     const result = await pool.query(query, [email]);
//     const user = result.rows[0];
// }