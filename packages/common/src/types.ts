import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(100),
    name: z.string()
})

export const SigninSchmema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(100)
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})