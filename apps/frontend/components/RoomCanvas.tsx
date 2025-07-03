"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            toast.error("Sign in to access the canvas.");
            router.push("/signin");
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}