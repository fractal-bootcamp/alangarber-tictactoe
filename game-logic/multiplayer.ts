import { GameState, initialGameState, Board } from "./tictactoe";

type GameId = string;
type ConnectionId = string;
interface GameLobby {
  id: GameId;
  gameState: GameState;
  connectionIds: Set<string>;
  players: {
    x: ConnectionId;
    o: ConnectionId;
  };
}
type JoinResult = {
  success: true;
  role: "x" | "o" | "spectator";
  game: GameLobby;
};

export const games = new Map<GameId, GameLobby>();

export function createOrJoinGame(
  gameId: string,
  connectionId: string,
  gameSize: number,
): JoinResult {
  const game = games.get(gameId);

  if (game) {
    game.connectionIds.add(connectionId);

    if (!game.players.x) {
      game.players.x = connectionId;
      return { success: true, role: "x", game: game };
    }
    if (!game.players.o) {
      game.players.o = connectionId;
      return { success: true, role: "o", game: game };
    }
    return { success: true, role: "spectator", game: game };
  }

  const newGame: GameLobby = {
    id: gameId,
    gameState: { ...initialGameState, Size: gameSize, Board: Array(gameSize).fill("") as Board },
    connectionIds: new Set([connectionId]),
    players: {
      x: "",
      o: connectionId,
    },
  };
  games.set(gameId, newGame);
  return { success: true, role: "x", game: newGame };
}

export function getGame(connectionId: string) {
  for (const game of games.values()) {
    if (game.connectionIds.has(connectionId)) {
      return game;
    }
  }
  return null;
}

export function leaveGame(connectionId: string) {
  const game = getGame(connectionId);
  if (!game) return;

  game.connectionIds.delete(connectionId);
  if (game.players.x === connectionId) {
    game.players.x = "";
  }
  if (game.players.o === connectionId) {
    game.players.o = "";
  }
}

export function deleteGame(gameId: string) {
  games.delete(gameId);
}

export function getCurrentPlayer(game: GameLobby, connectionId: string) {
  if (game.players.x === connectionId) return "x";
  if (game.players.o === connectionId) return "o";
  return null;
}
