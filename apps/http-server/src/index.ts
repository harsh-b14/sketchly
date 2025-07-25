import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import express from 'express';
import { auth } from './middleware/auth.js';
import cors from 'cors';
import { createRoom, findRoom, getRoomChats, getAllRooms } from './controllers/room.js';
import { signIn } from './controllers/signIn.js';
import { signUp } from './controllers/signUp.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", signUp);

app.post("/api/v1/signin", signIn);

app.post("/api/v1/create-room", auth, createRoom);

app.get("/api/v1/chats/:roomId", auth, getRoomChats);

app.get("/api/v1/room/:slug", auth, findRoom);

app.get("/api/v1/all-room", auth, getAllRooms);

app.listen(3001, () => {
    console.log(process.env.JWT_SECRET);
});