"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WS_PORTS = [8080, 8081, 8082];
const WS_HOST = "localhost";

function getRandomWsPort() {
  const idx = Math.floor(Math.random() * WS_PORTS.length);
  return WS_PORTS[idx];
}

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

        const port = getRandomWsPort();
        const ws = new WebSocket(`ws://${WS_HOST}:${port}?token=${token}`);

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
        return <div className="flex justify-center items-center h-screen w-screen">
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}