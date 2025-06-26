import { z } from "zod";
import { email } from "zod/v4";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string()
})

export const SigninSchmema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20)
})