import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: JwtPayload | string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token missing or invalid format",
        });
    }

    const token = authHeader.split(" ")[1] as string;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({
            message: "Server configuration error",
        });
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;




// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ message: "Authorization header missing" });
//     }
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ message: "Token missing" });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };

// export default authMiddleware;