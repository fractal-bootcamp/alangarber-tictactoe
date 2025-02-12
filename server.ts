import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  initialGameState,
  move,
  startNewGame,
  computerMove,
} from "./game-logic/tictactoe";
import {
  ConnectionId,
  initialLobbyState,
  isCurrentPlayer,
  createNewLobby,
  joinExistingLobby,
  createLonesomeLobby,
  createComputerLobby,
} from "./game-logic/lobbies";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, world");
});

const httpServer = createServer(app);
const PORT = 3001;

let lobby = initialLobbyState;

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("playerMove", (position: number, connectionId: ConnectionId) => {
    if (isCurrentPlayer(connectionId, lobby)) {
      lobby.gameState = move(position, lobby.gameState);
      io.emit("gameUpdate", lobby.gameState);
    } else if (isCurrentPlayer("computer", lobby)) {
      lobby.gameState = computerMove(lobby.gameState);
      io.emit("gameUpdate", lobby.gameState);
    } else {
      console.log("It is not your turn, ", lobby.gameState.Player);
    }
  });

  socket.on("startGame", (size: number, connectionId: ConnectionId) => {
    lobby.lobbyId = uuidv4();
    lobby.gameState = startNewGame(size);
    lobby = createNewLobby(connectionId, lobby);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("playSelf", (size: number, connectionId: ConnectionId) => {
    lobby.lobbyId = uuidv4();
    lobby.gameState = startNewGame(size);
    lobby = createLonesomeLobby(connectionId, lobby);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("playComputer", (size: number, connectionId: ConnectionId) => {
    lobby.lobbyId = uuidv4();
    lobby.gameState = startNewGame(size);
    lobby = createComputerLobby(connectionId, lobby);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("joinGame", (size: number, connectionId: ConnectionId) => {
    lobby = joinExistingLobby(size, connectionId);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("resetGame", () => {
    lobby.gameState = initialGameState;
    io.emit("gameUpdate", lobby.gameState);
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
