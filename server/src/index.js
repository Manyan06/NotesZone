import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import Note from "./models/Note.js";
import { getUserAccess } from "./utils/access.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ===== CORS ORIGIN =====
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// ===== SOCKET.IO =====
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true
  }
});

// ===== MIDDLEWARES =====
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Server running");
});

// ===== SOCKET AUTH =====
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// ===== SOCKET EVENTS =====
io.on("connection", (socket) => {

  socket.on("join_note", async ({ noteId }) => {
    try {
      const note = await Note.findById(noteId).lean();
      if (!note) {
        return socket.emit("error_message", { message: "Note not found" });
      }

      const access = getUserAccess(note, socket.user.id);
      if (!access) {
        return socket.emit("error_message", { message: "No access to this note" });
      }

      const room = `note_${noteId}`;
      socket.join(room);

      socket.emit("server_note_init", {
        ...note,
        access
      });

    } catch (err) {
      socket.emit("error_message", { message: "Join failed" });
    }
  });

  socket.on("leave_note", ({ noteId }) => {
    socket.leave(`note_${noteId}`);
  });

  socket.on("client_note_update", async ({ noteId, title, content }) => {
    if (!noteId) return;

    try {
      const note = await Note.findById(noteId);
      if (!note) return;

      const access = getUserAccess(note, socket.user.id);
      if (!["owner", "editor"].includes(access)) return;

      if (typeof title === "string") note.title = title;
      if (typeof content === "string") note.content = content;

      await note.save();

      const fresh = await Note.findById(noteId).lean();
      io.to(`note_${noteId}`).emit("server_note_update", {
        ...fresh,
        access
      });

    } catch (err) {
      // intentionally silent
    }
  });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on ${PORT}`);
});
