import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { CreateUserSchema, SigninSchmema, CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import { auth } from './middleware/auth.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Invalid input"
        });
        return;
    }
    // db call
    // has the password and store it in the database
    try{
        const user =  await prismaClient.user.create({
            data: {
                password: parsedData.data?.password,
                email: parsedData.data?.email,
                name: parsedData.data?.name
            }
        })
        res.json({
            userId: user.id,
            message: "User created successfully"
        })
    } catch(e){
        console.log(e);
        res.status(411).json({
            message: "User already exists"
        })
    }

    res.json({
        userId: 123,
    })
})

app.post("/signin", async (req, res) => {

    const parsedData = SigninSchmema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Invalid input"
        });
        return;
    }
    
    // compate the hased password
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data?.email,
                password: parsedData.data?.password
            }
        })
        if(!user){
            res.status(401).json({
                message: "Invalid credentials"
            });
            return;
        }
        const token = jwt.sign({
            userId: user?.id,
        }, process.env.JWT_SECRET as string)
        res.status(200).json({
            message: "Signin successful",
            token,
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Invalid credentials"
        });
        return;
    }
}) 

app.post("/create-room", auth, async (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Invalid input"
        });
        return;
    }
    //@ts-ignore :: fix this
    const userId = req.userId;
    if(!userId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        const room  = await prismaClient.room.create({
            data: {
                slug: parsedData.data.slug,
                adminId: userId
            }
        })
        
        res.json({
            roomId: room.id,
            message: "Room created successfully"
        })
        return;
    } catch (error) {
        res.status(411).json({
            message: "Room already exists"
        })
    }
});

app.get("/chats/:roomId", auth, async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
    
        if(!roomId){
            res.status(400).json({
                message: "Invalid room id"
            });
            return;
        }

        const chats =  await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: 'desc'
            }, 
            take: 50
        });

        res.status(200).json({
            chats
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            chats: []
        })
    }
})

app.get("/room/:slug", auth, async (req, res) => {
    try {
        const slug = req.params.slug;
        const room = prismaClient.room.findFirst({
            where:{
                slug: slug
            }
        })

        if(!room){
            res.status(404).json({
                message: "Room not found"
            });
            return;
        }
        res.status(200).json({
            room
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: []
        });
        return;
        
    }
})

app.listen(3001, () => {
    console.log(process.env.JWT_SECRET);
});