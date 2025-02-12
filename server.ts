import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { initialGameState, move, startTheGame } from "./game-logic/tictactoe";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, world");
});

const httpServer = createServer(app);
const PORT = 3001;

let game = initialGameState;

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("playerMove", (position: number) => {
    game = move(position, game);
    io.emit("gameUpdate", game);
  });

  socket.on("startGame", (size: number) => {
    game = startTheGame(size);
    io.emit("gameUpdate", game);
  });

  socket.on("resetGame", () => {
    game = initialGameState;
    io.emit("gameUpdate", game);
  });

  socket.on("disconnect", () => {
    console.log("Player Disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `Backend is running on Express server on http://localhost:${PORT}`,
  );
});
