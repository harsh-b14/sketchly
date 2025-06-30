import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(3).max(50)
})

export const SigninSchmema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20)
})