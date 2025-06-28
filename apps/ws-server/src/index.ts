import 'dotenv/config';
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

import { WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}

const users: User[] = [];

function checkUser(token: string): string | null{
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        if(typeof decodedToken == "string"){
            return null;
        }

        if(!decodedToken || !decodedToken.userId){
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

    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";

    const userId = checkUser(token);
    if(userId == null){
        ws.close();
        return;
    }

    users.push({
        ws,
        userId,
        rooms: []
    })

    ws.on("message", async function message(data) {
        let parsedData;
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data);
        }

        if(parsedData.type === "join_room") {
            const user = users.find(u => u.ws === ws);
            user?.rooms.push(parsedData.roomId);
        }

        if(parsedData.type === "leave_room"){
            const user = users.find(u => u.ws === ws);
            if(!user) return;
            user.rooms = user?.rooms.filter(room => room !== parsedData.roomId);
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data: {
                    userId: userId,
                    roomId: roomId,
                    message: message
                }
            })

            users.forEach(u => {
                u.rooms.includes(roomId) && u.ws.send(JSON.stringify({
                    type: "chat",
                    message,
                    roomId
                }));
            })
        }

    });
});