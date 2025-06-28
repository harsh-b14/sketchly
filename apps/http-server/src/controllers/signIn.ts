import 'dotenv/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SigninSchmema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export const signIn = async (req: Request, res: Response) => {
  const parsedData = SigninSchmema.safeParse(req.body);

  console.log(parsedData);

  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { email, password } = parsedData.data;

  try {
    const user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Please enter correct password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Signin successful",
      token,
    });
    return;
  } catch (error) {
    console.error("SignIn error:", error);
    res.status(500).json({
         message: "Something went wrong" 
    });
    return;
  }
};