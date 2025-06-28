"use client"

import { useEffect, useRef } from "react"
import { start } from "repl";

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if(!ctx) return;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "white";
            
            let startX = 0;
            let startY = 0;
            let isDrawing = false;

            canvas.addEventListener("mousedown", (e) => {
                isDrawing = true;
                startX = e.clientX;
                startY = e.offsetY;
            })

            canvas.addEventListener("mouseup", (e) => {
                isDrawing = false;
            })

            canvas.addEventListener("mousemove", (e) => {
                if(isDrawing){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    let width = e.clientX - startX;
                    let height = e.clientY - startY;
                    ctx.strokeRect(startX, startY, width, height);
                }
            })

        }
    }, [canvasRef])

    return(
        <div 
        className="width-full h-screen bg-gray-900"
        >
            <canvas className="z-10" ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <div className="fixed top-10 "></div>
        </div>
    )
}