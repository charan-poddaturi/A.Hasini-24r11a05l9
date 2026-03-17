import http from "http";
import app from "./app";
import { connectDb } from "./db";
import { config } from "./config";
import { Server as SocketIOServer } from "socket.io";
import { log } from "./utils/logger";

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
  log.info("Socket connected", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    log.info("Socket disconnected", socket.id);
  });
});

const start = async () => {
  await connectDb();
  server.listen(config.port, () => {
    log.info(`🚀 Server listening on http://localhost:${config.port}`);
  });
};

start().catch((e) => {
  log.error(e);
  process.exit(1);
});
