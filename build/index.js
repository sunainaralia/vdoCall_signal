"use strict";
// import cors from "cors";
// import express from "express";
// import { createServer } from "http";
// import morgan from "morgan";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// let users = [];
// let liveSessions = [];
// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// app.use(cors());
// app.use(morgan("combined"));
// app.use(express.json());
// // Endpoint to view live sessions
// app.get("/live-sessions", (req, res) => {
//   res.json({ liveSessions });
// });
// // Middleware to authenticate users
// io.use((socket, next) => {
//   const { callerId } = socket.handshake.query;
//   if (callerId) {
//     socket.data.user = callerId;
//     next();
//   } else {
//     console.log("No caller ID found");
//     next(new Error("No caller ID found"));
//   }
// });
// // Handle socket connections
// io.on("connection", (socket) => {
//   const userId = socket.data.user;
//   console.log("User connected:", userId);
//   socket.join(userId);
//   // Notify user about existing live sessions
//   io.to(userId).emit("live-sessions", { liveSessions });
//   // Start a live session
//   socket.on("start-live", ({ sessionName }) => {
//     console.log(`${userId} started a live session: ${sessionName}`);
//     const session = { hostId: userId, sessionName };
//     liveSessions.push(session);
//     io.emit("new-live-session", session);
//   });
//   // Handle join live session
//   socket.on("join-live", ({ hostId }) => {
//     console.log(`${userId} is joining the live session hosted by ${hostId}`);
//     io.to(hostId).emit("incoming-viewer", { viewerId: userId });
//   });
//   // Handle offer from broadcaster to viewer
//   socket.on("offer", ({ to, offer }) => {
//     console.log(`Offer from ${userId} to ${to}`);
//     io.to(to).emit("offer", { from: userId, offer });
//   });
//   // Handle answer from viewer to broadcaster
//   socket.on("answer", ({ to, answer }) => {
//     console.log(`Answer from ${userId} to ${to}`);
//     io.to(to).emit("answer", { from: userId, answer });
//   });
//   // Handle ICE candidates
//   socket.on("ice-candidate", ({ to, candidate }) => {
//     console.log(`ICE Candidate from ${userId} to ${to}`);
//     io.to(to).emit("ice-candidate", { from: userId, candidate });
//   });
//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${userId}`);
//     liveSessions = liveSessions.filter((session) => session.hostId !== userId);
//     io.emit("live-session-ended", { hostId: userId });
//   });
// });
// // Start server
// const PORT = process.env.PORT || 8088;
// httpServer.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
// Import necessary modules
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_js_1 = __importDefault(require("../app.js"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// Load environment variables
dotenv_1.default.config({ path: "./config.env" });
// MongoDB connection
mongoose_1.default
    .connect(process.env.CONN_STR)
    .then(() => {
    console.log("MongoDB connected successfully");
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
// Create the HTTP server and attach it to the app instance
const httpServer = (0, http_1.createServer)(app_js_1.default);
// Set up Socket.IO server with CORS
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// In-memory session data
let users = [];
let liveSessions = [];
app_js_1.default.use((0, cors_1.default)());
app_js_1.default.use((0, morgan_1.default)("combined"));
// Endpoint to view live sessions
app_js_1.default.get("/live-sessions", (req, res) => {
    console.log("Live Session Working");
    res.json({ liveSessions });
});
// Middleware for authenticating Socket.IO users
io.use((socket, next) => {
    const { callerId } = socket.handshake.query;
    if (callerId) {
        socket.data.user = callerId;
        next();
    }
    else {
        console.log("No caller ID found");
        next(new Error("No caller ID found"));
    }
});
// Handle Socket.IO connections and events
io.on("connection", (socket) => {
    const userId = socket.data.user;
    console.log("User connected:", userId);
    socket.join(userId);
    // Notify the user about existing live sessions
    io.to(userId).emit("live-sessions", { liveSessions });
    // Start a live session
    socket.on("start-live", ({ sessionName }) => {
        console.log(`${userId} started a live session: ${sessionName}`);
        const session = { hostId: userId, sessionName };
        liveSessions.push(session);
        io.emit("new-live-session", session);
    });
    // Handle other socket events (e.g., joining live, ICE candidates)
    socket.on("join-live", ({ hostId }) => {
        console.log(`${userId} is joining the live session hosted by ${hostId}`);
        io.to(hostId).emit("incoming-viewer", { viewerId: userId });
    });
    socket.on("offer", ({ to, offer }) => {
        console.log(`Offer from ${userId} to ${to}`);
        io.to(to).emit("offer", { from: userId, offer });
    });
    socket.on("answer", ({ to, answer }) => {
        console.log(`Answer from ${userId} to ${to}`);
        io.to(to).emit("answer", { from: userId, answer });
    });
    socket.on("ice-candidate", ({ to, candidate }) => {
        console.log(`ICE Candidate from ${userId} to ${to}`);
        io.to(to).emit("ice-candidate", { from: userId, candidate });
    });
    // end video call
    socket.on("end-vdo", () => {
        console.log(liveSessions);
        liveSessions = liveSessions.filter((session) => session.hostId !== userId);
        console.log(liveSessions);
        console.log("vdo call ended by ", userId);
        io.emit("live-session-ended", { hostId: userId });
    });
    // Handle disconnection and update live sessions
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}`);
        liveSessions = liveSessions.filter((session) => session.hostId !== userId);
        io.emit("live-session-ended", { hostId: userId });
    });
});
// Start the server on the configured port
const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map