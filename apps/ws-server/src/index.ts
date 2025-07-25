import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import Redis from "ioredis";

const PORT = Number(process.env.PORT || 8080);
const wss = new WebSocketServer({ port: PORT });

interface User {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}

const users: User[] = [];

const redisPub = new Redis.default();
const redisSub = new Redis.default();

// Track which rooms this server is subscribed to
const subscribedRooms = new Set<string>();

function checkUser(token: string): string | null {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        if (!decodedToken || !decodedToken.userId) {
            return null;
        }

        return decodedToken.userId;
    } catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
}

wss.on("connection", async (ws, request) => {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";

    const userId = checkUser(token);
    if (userId == null) {
        ws.close();
        return;
    }

    users.push({
        ws,
        userId,
        rooms: []
    });

    ws.on("message", async function message(data) {
        let parsedData;
        
        try {
            if(typeof data !== "string"){
                parsedData = JSON.parse(data.toString());
            } else {
                parsedData = JSON.parse(data);
            }
        } catch (err) {
            console.log(err);
            ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format." }));
            return;
        }

        console.log(parsedData);

        const user = users.find(u => u.ws === ws);
        if (!user) return;

        try {
            if (parsedData.type === "join_room") {
                const roomId = Number(parsedData.roomId);
            
                const room = await prismaClient.room.findUnique({
                    where: { id: roomId }
                });
            
                if (!room) {
                    ws.send(JSON.stringify({
                        type: "warning",
                        message: `Room with ID ${roomId} does not exist.`
                    }));
                    return;
                }
            
                if (!user.rooms.includes(String(roomId))) {
                    user.rooms.push(String(roomId));
                    // Subscribe to Redis channel for this room if not already
                    const channel = `room:${roomId}`;
                    if (!subscribedRooms.has(channel)) {
                        await redisSub.subscribe(channel);
                        subscribedRooms.add(channel);
                    }
                }
            
                ws.send(JSON.stringify({
                    type: "info",
                    message: `Successfully joined room ${roomId}.`
                }));
            }

            if (parsedData.type === "leave_room") {
                const roomId = parsedData.roomId;
                user.rooms = user.rooms.filter(room => room !== String(roomId));
                const channel = `room:${roomId}`;
                if (subscribedRooms.has(channel)) {
                    await redisSub.unsubscribe(channel);
                    subscribedRooms.delete(channel);
                }
            }

            if (parsedData.type === "chat") {
                const roomId = Number(parsedData.roomId);
                const messageText = parsedData.message;

                if (!user.rooms.includes(String(roomId))) {
                    ws.send(JSON.stringify({
                        type: "warning",
                        message: `You're not joined to room ${roomId}. Use "join_room" before chatting.`
                    }));
                    console.log(`User ${user.userId} tried to send a message in room ${roomId} without joining.`);
                    return;
                }

                const room = await prismaClient.room.findUnique({
                    where: { id: roomId }
                });

                if (!room) {
                    ws.send(JSON.stringify({
                        type: "warning",
                        message: `Room ${roomId} does not exist.`
                    }));
                    console.log(`User ${user.userId} tried to send a message in non-existent room ${roomId}.`);
                    return;
                }

                const chat = await prismaClient.chat.create({
                    data: {
                        userId: user.userId,
                        roomId: roomId,
                        message: messageText
                    }
                });

                if(!chat){
                    console.log("Failed to create chat message in database.");
                    return;
                }
                // Publish to Redis instead of local broadcast
                const payload = JSON.stringify({
                    type: "chat",
                    message: messageText,
                    roomId,
                    userId: user.userId
                });
                redisPub.publish(`room:${roomId}`, payload);
                // No local broadcast here; handled by Redis subscription below
                console.log(`User ${user.userId} sent a message in room ${roomId}: ${messageText}`);
            }

        } catch (err) {
            console.error("WebSocket message error:", err);
            ws.send(JSON.stringify({
                type: "error",
                message: "An unexpected error occurred. Please try again later."
            }));
        }
    });

    ws.send(JSON.stringify({ type: "info", message: "Connected to WebSocket server." }));
});

// Listen for messages from Redis and broadcast to local users
redisSub.on("message", (channel, message) => {
    // channel format: room:{roomId}
    const roomId = channel.split(":")[1];
    let parsed;
    try {
        parsed = JSON.parse(message);
    } catch (e) {
        console.error("Invalid JSON from Redis pubsub:", message);
        return;
    }
    // Broadcast to all local users in this room
    users.forEach(u => {
        if (u.rooms.includes(String(roomId))) {
            u.ws.send(JSON.stringify(parsed));
        }
    });
});