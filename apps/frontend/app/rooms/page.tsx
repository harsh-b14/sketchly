"use client";

import { BACKEND_URL } from "@/config";
import { restoreToken } from "@/lib/redux/slices/authSlice";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<{ id: string; slug: string; adminId: string }[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomLink, setRoomLink] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchRooms() {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    axios.defaults.headers.common["Authorization"] = `${token}`;
                    dispatch(restoreToken(token));
                }

                const res = await axios.get(`${BACKEND_URL}/api/v1/all-room`);
                setRooms(res.data.rooms);
            } catch (error: any) {
                console.error("Failed to fetch rooms:", error);
                toast.error(error?.response?.data?.message || "Could not fetch rooms");
            }
        }

        fetchRooms();
    }, []);

    const handleCreateRoom = async () => {
        if (!roomName) {
            toast.error("Room name required");
            return;
        }

        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/create-room`, {
            slug: roomName,
            });

            const room = {
                id: res.data.roomId,
                slug: res.data.slug,
                adminId: res.data.adminId,
            };

            setRooms((prev) => [...prev, room]);
            setShowCreateModal(false);
            setRoomName("");
            toast.success("Room created");
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to create room");
        }
    };

    const handleJoinRoom = () => {
        if (!roomLink) {
            toast.error("Enter a valid room link");
            return;
        }

        toast.success("Joining room...");
        setShowJoinModal(false);
        setRoomLink("");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-8">
        <div className="w-full max-w-[1200px] px-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Available Rooms</h1>

            <div className="flex justify-center gap-4 mb-8">
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowCreateModal(true)}>
                Create Room
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowJoinModal(true)}>
                Join Room
            </Button>
            </div>

            {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {rooms.map((room) => (
                <div
                    key={room.id}
                    className="w-[280px] bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-transform transform hover:scale-[1.02] hover:shadow-2xl border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-blue-400 break-words mb-2">
                    {room.slug}
                    </h2>
                    <p className="text-sm text-gray-300 mb-4">
                    Admin ID: <span className="font-mono break-words">{room.adminId}</span>
                    </p>
                    <Button 
                        onClick={() => {
                            router.push(`/canvas/${room.id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-auto w-full rounded-lg"
                    >
                    Open Room
                    </Button>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center mt-10 text-lg text-red-400 font-semibold">
                No rooms to show.
            </div>
            )}
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">Create a Room</h2>
                <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={handleCreateRoom} className="bg-green-600">
                    Create
                </Button>
                </div>
            </div>
            </div>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">Join a Room</h2>
                <input
                type="text"
                value={roomLink}
                onChange={(e) => setRoomLink(e.target.value)}
                placeholder="Paste room shareable link"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end gap-2">
                <Button onClick={() => setShowJoinModal(false)}>Cancel</Button>
                <Button onClick={handleJoinRoom} className="bg-indigo-600">
                    Join
                </Button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
