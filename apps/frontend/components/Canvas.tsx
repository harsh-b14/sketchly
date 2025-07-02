import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    // useEffect(() => {
    //     let g: Game;
      
    //     (async () => {
    //       if (canvasRef.current) {
    //         g = new Game(canvasRef.current, roomId, socket);
    //         await g.init();            // gets shapes and stores internally
    //         setGame(g);                // React state update
    //         g.clearCanvas();           // ✅ force re-draw shapes after state set
    //       }
    //     })();
      
    //     return () => {
    //       if (g) g.destroy();
    //     };
    //   }, [roomId, socket, canvasRef]);
      

    useEffect(() => {
        let g: Game;
      
        (async () => {
            if (canvasRef.current) {
              g = new Game(canvasRef.current, roomId, socket);
              await g.init();            // gets shapes and stores internally
              setGame(g);                // React state update
              g.clearCanvas();           // ✅ force re-draw shapes after state set
            }
          })();
        
          return () => {
            if (g) g.destroy();
          };
    }, [canvasRef]);   
    
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                game?.clearCanvas(); 
            }
        };
      
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
      
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [game]);
      

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
        </div>
}