import {
  GameState,
  initialGameState,
  Player,
  createInterruption,
} from "./tictactoe";

export type ConnectionId = string;

export type Lobbies = Lobby[];

export type Lobby = {
  gameState: GameState;
  lobbyId: string;
  players: Map<Player, ConnectionId>;
};

export const initialLobbyState = {
  gameState: initialGameState,
  lobbyId: "0",
  players: new Map<Player, ConnectionId>(),
} as Lobby;

export const lobbies: Lobbies = [];

export function isCurrentPlayer(
  connectionId: ConnectionId,
  lobby: Lobby,
): boolean {
  return connectionId === lobby.players.get(lobby.gameState.Player);
}

export function createNewLobby(
  connectionId: ConnectionId,
  lobbyState: Lobby,
): Lobby {
  const newLobby: Lobby = {
    ...lobbyState,
    players: new Map(lobbyState.players),
  };

  if (!newLobby.players.get("x")) {
    newLobby.players.set("x", connectionId);
    lobbies.push(newLobby);
  }

  return newLobby;
}

export function createLonesomeLobby(
  connectionId: ConnectionId,
  lobbyState: Lobby,
): Lobby {
  const newLonesomeLobby: Lobby = {
    ...lobbyState,
    players: new Map(lobbyState.players),
  };

  newLonesomeLobby.players.set("x", connectionId);
  newLonesomeLobby.players.set("o", connectionId);

  return newLonesomeLobby;
}

export function createComputerLobby(
  connectionId: ConnectionId,
  lobbyState: Lobby,
): Lobby {
  const newLobby: Lobby = {
    ...lobbyState,
    players: new Map(lobbyState.players),
  };

  newLobby.players.set("x", connectionId);
  newLobby.players.set("o", "computer");

  return newLobby;
}

export function joinExistingLobby(size: number, connectionId: string): Lobby {
  if (searchLobbies(size) === -1) {
    const errorMessageLobby: Lobby = {
      ...initialLobbyState,
      gameState: createInterruption(
        "No human is waiting for a game like this ☹️",
        initialLobbyState.gameState,
      ),
    };
    return errorMessageLobby;
  } else {
    const newLobby: Lobby = { ...lobbies[searchLobbies(size)] };
    newLobby.players.set("o", connectionId);
    return newLobby;
  }
}

export function searchLobbies(size: number): number {
  return lobbies.findIndex(
    (lobby) =>
      lobby.gameState.Size === size &&
      lobby.players.get("x") &&
      !lobby.players.get("o"),
  );
}
