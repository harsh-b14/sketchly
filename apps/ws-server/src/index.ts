import 'dotenv/config';
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}

const users: User[] = [];

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
                }
            
                ws.send(JSON.stringify({
                    type: "info",
                    message: `Successfully joined room ${roomId}.`
                }));
            }

            if (parsedData.type === "leave_room") {
                const roomId = parsedData.roomId;
                user.rooms = user.rooms.filter(room => room !== String(roomId));

                ws.send(JSON.stringify({
                    type: "info",
                    message: `Left room ${roomId}.`
                }));
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

                // Broadcast to all users in that room
                users.forEach(u => {
                    if (u.rooms.includes(String(roomId))) {
                        u.ws.send(JSON.stringify({
                            type: "chat",
                            message: messageText,
                            roomId,
                        }));
                    }
                });

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