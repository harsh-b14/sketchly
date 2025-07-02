import { BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const token = localStorage.getItem("token");
    if(!token) {
        throw new Error("User not authenticated");
    }
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${BACKEND_URL}/api/v1/chats/${roomId}`);
    const chats = res.data.chats;

    if (!chats || !Array.isArray(chats)) {
        console.error("Chats are missing or not an array:", chats);
        return [];
    }  

    const shapes = chats.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    });

    return shapes;
}