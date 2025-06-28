import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if(decodedToken){
        // @ts-ignore : TODO = remove ts-ignore after fixing types
        req.userId = decodedToken.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized access",
        })
    }
}