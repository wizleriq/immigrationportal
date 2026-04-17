import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email";
    const values = [email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const loginUser = async (email: string, password: string) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    const user = result.rows[0];

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