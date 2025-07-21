import { useParams } from 'react-router-dom';
import { RoomCanvas } from "../components/RoomCanvas";

export default function CanvasPage() {
    const { roomId } = useParams<{ roomId: string }>();
    if (!roomId) return <div>Room ID not found</div>;
    return <RoomCanvas roomId={roomId} />;
}