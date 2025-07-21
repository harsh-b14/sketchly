import { BACKEND_URL } from "../config";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateRoom() {
    const [slug, setSlug] = useState("");
    const navigate = useNavigate();

    const createRoomHandler = async () => {
        if (!slug.trim()) {
            toast.error("Room name cannot be empty");
            return;
        }

        try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in");
            return;
        }

        const res = await axios.post(
            `${BACKEND_URL}/api/v1/create-room`,
            { slug },
            {
            headers: {
                Authorization: token,
            },
            }
        );

        toast.success("Room created!");
        navigate(`/room/${res.data.slug}`);

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error creating room");
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <div className="text-4xl mb-6">Create a Room</div>
        <Input
            placeholder="Enter room name"
            className="w-1/2 mb-4 p-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
        />
        <Button onClick={createRoomHandler} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
            Create Room
        </Button>
        </div>
    );
}