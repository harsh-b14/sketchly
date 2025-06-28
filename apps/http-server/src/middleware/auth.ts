import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
    };

    if(decodedToken){
        req.userId = decodedToken.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized access",
        })
    }
}