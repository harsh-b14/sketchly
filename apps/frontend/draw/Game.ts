import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "ellipse";
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "pencil_buffer";
    points: Shape[];
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private pencilBuffer: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private lastX = 0;
    private lastY = 0;
    private selectedTool: Tool = "rect";
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.pencilBuffer = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool: "line" | "pencil" | "rect" | "ellipse") {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        if (this.existingShapes.length > 0) {
            await this.clearCanvas();
        }
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "chat") {
                const parsed = JSON.parse(message.message);
                if (parsed.shape) {
                    this.existingShapes.push(parsed.shape);
                } else if (parsed.shapes) {
                    this.existingShapes.push(...parsed.shapes);
                }
                this.clearCanvas();
            }
        };
    }

    async clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            console.log("shape", shape);
            console.log("shape type", shape.type);
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "ellipse") {
                this.drawEllipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY);
            } else if (shape.type === "line") {
                this.drawLine(shape.startX, shape.startY, shape.endX, shape.endY);
            } else if (shape.type === "pencil_buffer") {
                shape.points.forEach((point) => {
                    if(point.type === "pencil" || point.type === "line") {
                        this.drawLine(point.startX, point.startY, point.endX, point.endY);
                    }
                })
            } else if (shape.type === "pencil") {
                this.drawLine(shape.startX, shape.startY, shape.endX, shape.endY);
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    };

    // mouseUpHandler = (e: MouseEvent) => {
    //     this.clicked = false;
    //     const width = e.clientX - this.startX;
    //     const height = e.clientY - this.startY;
    //     const selectedTool = this.selectedTool;
    //     let shape: Shape | null = null;

    //     if (selectedTool === "rect") {
    //         shape = {
    //             type: "rect",
    //             x: this.startX,
    //             y: this.startY,
    //             height,
    //             width
    //         };
    //     } else if (selectedTool === "ellipse") {
    //         const radiusX = Math.abs(width) / 2;
    //         const radiusY = Math.abs(height) / 2;
    //         const centerX = (width < 0) ? this.startX - radiusX : this.startX + radiusX;
    //         const centerY = (height < 0) ? this.startY - radiusY : this.startY + radiusY;
    //         shape = {
    //             type: "ellipse",
    //             centerX,
    //             centerY,
    //             radiusX,
    //             radiusY
    //         };
    //     } else if (selectedTool === "line") {
    //         shape = {
    //             type: "line",
    //             startX: this.startX,
    //             startY: this.startY,
    //             endX: e.clientX,
    //             endY: e.clientY
    //         };
    //     } else if (selectedTool === "pencil") {
    //         if (this.pencilBuffer.length > 0) {
    //             shape = {
    //                 type: "pencil_buffer",
    //                 points: this.pencilBuffer
    //             }
    //             this.pencilBuffer = [];
    //         }
    //         return;
    //     }

    //     if (!shape) return;

    //     this.existingShapes.push(shape);
    //     this.socket.send(JSON.stringify({
    //         type: "chat",
    //         message: JSON.stringify({ shape }),
    //         roomId: this.roomId
    //     }));
    // };

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
    
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            };
        } else if (selectedTool === "ellipse") {
            const radiusX = Math.abs(width) / 2;
            const radiusY = Math.abs(height) / 2;
            const centerX = (width < 0) ? this.startX - radiusX : this.startX + radiusX;
            const centerY = (height < 0) ? this.startY - radiusY : this.startY + radiusY;
            shape = {
                type: "ellipse",
                centerX,
                centerY,
                radiusX,
                radiusY
            };
        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            };
        } else if (selectedTool === "pencil") {
            if (this.pencilBuffer.length > 0) {
                shape = {
                    type: "pencil_buffer",
                    points: [...this.pencilBuffer]
                };
                this.pencilBuffer = []; 
            }
        }
    
        if (!shape) return;
    
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId
        }));
    };
    
    drawRectangle = (x: number, y: number, width: number, height: number) => {
        this.ctx.strokeRect(x, y, width, height);
    };

    drawEllipse = (centerX: number, centerY: number, radiusX: number, radiusY: number) => {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    };

    drawLine = (startX: number, startY: number, endX: number, endY: number) => {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            const selectedTool = this.selectedTool;

            if (selectedTool === "rect") {
                this.drawRectangle(this.startX, this.startY, width, height);
            } else if (selectedTool === "ellipse") {
                const radiusX = Math.abs(width) / 2;
                const radiusY = Math.abs(height) / 2;
                const centerX = (width < 0) ? this.startX - radiusX : this.startX + radiusX;
                const centerY = (height < 0) ? this.startY - radiusY : this.startY + radiusY;
                this.drawEllipse(centerX, centerY, radiusX, radiusY);
            } else if (selectedTool === "line") {
                this.drawLine(this.startX, this.startY, e.clientX, e.clientY);
            } else if (selectedTool === "pencil") {
                const newShape: Shape = {
                    type: "pencil",
                    startX: this.lastX,
                    startY: this.lastY,
                    endX: e.clientX,
                    endY: e.clientY
                };
                this.drawLine(newShape.startX, newShape.startY, newShape.endX, newShape.endY);
                this.pencilBuffer.push(newShape);
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        }
    };

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}
