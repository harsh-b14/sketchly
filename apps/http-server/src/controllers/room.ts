import 'dotenv/config';
import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export const createRoom = async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: 'Invalid request data',
        });
        return;
    }

    try{
        const { slug } = parsedData.data;

        if(!slug) {
            res.status(400).json({
                message: 'Slug is required',
            });
            return;
        }

        const userId = req?.userId;

        if(!userId) {
            res.status(403).json({
                message: 'Unauthorized access',
            });
            return;
        }
        
        const room = await prismaClient.room.create({
            data: {
                slug,
                adminId: userId
            }
        })

        res.status(201).json({
            message: 'Room created successfully',
            roomId: room.id,
            slug: room.slug,
            adminId: room.adminId
        })
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Failed to create room',
        });
        return;
    }
}

export const getRoomChats = async (req: Request, res: Response) => {
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
}


export const findRoom = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;
        if(!slug){
            res.status(400).json({
                message: "Slug is required"
            });
            return;
        }

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
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: []
        });
        return;
        
    }
}