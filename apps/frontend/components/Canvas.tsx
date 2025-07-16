"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  CircleDashed,
  Pencil,
  RectangleHorizontalIcon,
  Share2,
  Check,
  Clipboard,
  Slash,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { Button } from "@repo/ui/button";
import { BACKEND_URL } from "@/config";
import { Input } from "@repo/ui/input";

export type Tool = "line" | "pencil" | "rect" | "ellipse";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const [color, setColor] = useState<string>("#ffffff");
  const [stroke, setStroke] = useState<number>(2);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `http://localhost:3000/canvas/${roomId}`;

  useEffect(() => {
    game?.setTool(selectedTool);
    if (game) {
      game.setColor?.(color);
      game.setStroke?.(stroke);
    }
  }, [selectedTool, color, stroke, game]);

  useEffect(() => {
    let g: Game;

    (async () => {
      if (canvasRef.current) {
        g = new Game(canvasRef.current, roomId, socket);
        await g.init();
        setGame(g);
        g.clearCanvas();
      }
    })();

    return () => {
      if (g) g.destroy();
    };
  }, [roomId, socket, canvasRef]);

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

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <Topbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        color={color}
        setColor={setColor}
        stroke={stroke}
        setStroke={setStroke}
        onShare={() => setShowShareModal(true)}
      />

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl text-black">
            <h2 className="text-2xl font-semibold mb-4">Share this Room</h2>
            <div className="relative mb-4">
              <Input
                className="w-full pr-10 read-only:"
                type="text"
                value={shareUrl}
                onChange={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-black"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Clipboard className="w-5 h-5" />}
              </Button>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowShareModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
  color,
  setColor,
  stroke,
  setStroke,
  onShare,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  stroke: number;
  setStroke: (n: number) => void;
  onShare: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        zIndex: 10,
        background: "rgba(30,30,30,0.95)",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div className="flex gap-2">
        <IconButton
          onClick={() => setSelectedTool("pencil")}
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
        />
        <IconButton
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
        />
        <IconButton
          onClick={() => setSelectedTool("line")}
          activated={selectedTool === "line"}
          icon={<Slash />}
        />
        <IconButton
          onClick={() => setSelectedTool("ellipse")}
          activated={selectedTool === "ellipse"}
          icon={<CircleDashed />}
        />
        <IconButton onClick={onShare} activated={false} icon={<Share2 />} />
      </div>
      <div className="flex items-center gap-2 ml-4">
        <label className="text-white text-sm mr-2">Color</label>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-8 h-8 border-2 border-white rounded-full cursor-pointer"
          style={{ background: color }}
        />
      </div>
      <div className="flex items-center gap-2 ml-4">
        <label className="text-white text-sm mr-2">Stroke</label>
        <input
          type="range"
          min={1}
          max={10}
          value={stroke}
          onChange={e => setStroke(Number(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className="text-white text-xs w-6 text-center">{stroke}</span>
      </div>
    </div>
  );
}
