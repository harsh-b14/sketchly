import 'dotenv/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CreateUserSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export const signUp = async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { name, email, password } = parsedData.data;

  try {
    const user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (user) {
      res.status(401).json({ message: "Email id already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prismaClient.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        }
    })

    const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "User registered succesfully",
      token,
    });
    return;
  } catch (error) {
    console.error("SignUp error:", error);
    res.status(500).json({
         message: "Something went wrong" 
    });
    return;
  }
};