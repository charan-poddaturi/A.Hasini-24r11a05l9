import http from "http";
import app from "./app";
import { connectDb } from "./db";
import { config } from "./config";
import { Server as SocketIOServer } from "socket.io";


const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to app locals so controllers can emit
app.locals.io = io;

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

const start = async () => {
  await connectDb();
  server.listen(config.port, () => {
    console.log(`🚀 Server listening on http://localhost:${config.port}`);
  });
};

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
