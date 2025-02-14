export type Player = "x" | "o";
export type Cell = Player | "";
export type Board = Cell[];
export type Wins = number[][];
export type Mode = "computer" | "solo" | "multiplayer";

export type GameState = {
  Player: Player;
  Board: Board;
  Size: number;
  Start: boolean;
  Result: "x" | "o" | "tie" | "unfinished";
  InterruptionMessage: string;
  computerMove: boolean;
  Mode: Mode;
};

export const initialGameState = {
  Player: "x" as Player,
  Board: [""] as Board,
  Size: 0,
  Start: false,
  Result: "unfinished",
  Mode: "solo",
  computerMove: false,
  InterruptionMessage: "",
  ComputerOpponent: false,
} as GameState;

export function calculateWins(size: number): Wins {
  const horizontalWins: Wins = [];
  for (let i = 0; i < size; i++) {
    horizontalWins[i] = [];
    for (let j = 0; j < size; j++) {
      horizontalWins[i][j] = i * size + j;
    }
  }
  const verticalWins: Wins = [];
  for (let k = 0; k < size; k++) {
    verticalWins[k] = [];
    for (let l = 0; l < size; l++) {
      verticalWins[k][l] = k + size * l;
    }
  }
  const diagonalWins: Wins = [[], []];
  for (let m = 0; m < size; m++) {
    diagonalWins[0][m] = m + size * m;
    diagonalWins[1][m] = size - 1 + (size - 1) * m;
  }
  const Wins: Wins = [...horizontalWins, ...verticalWins, ...diagonalWins];
  return Wins;
}

export function initialBoardState(size: number): Board {
  return new Array(size * size).fill("") as Board;
}

export function startNewGame(size: number, mode: Mode): GameState {
  return {
    ...initialGameState,
    Board: initialBoardState(size),
    Size: size,
    Start: true,
    Mode: mode,
  };
}

export function changePlayer(player: Player): Player {
  if (player === "x") {
    return "o";
  }
  return "x";
}

export function checkWin(
  board: Board,
  player: Player,
  wins: Wins,
): Player | undefined {
  for (let i = 0; i < wins.length; i++) {
    let winCon: number = 0;
    for (let j = 0; j < wins[i].length; j++) {
      if (board[wins[i][j]] === player) {
        winCon++;
      }
      if (winCon === wins[i].length) {
        return player;
      }
    }
  }
  return undefined;
}

export function createInterruption(
  interruption: string,
  prevGame: GameState,
): GameState {
  const newGame: GameState = {
    ...prevGame,
    InterruptionMessage: interruption,
  };

  return newGame;
}

export function closeInterruption(prevGame: GameState): GameState {
  const newGame: GameState = {
    ...prevGame,
    Board: [...prevGame.Board],
    InterruptionMessage: "",
  };

  return newGame;
}

export function computerMove(prevGame: GameState): GameState {
  const indexes: number[] = [];
  for (let i = 0; i < prevGame.Board.length; i++) {
    if (prevGame.Board[i] === "") {
      indexes.push(i);
    }
  }
  const randomIndex = indexes[Math.floor(Math.random() * indexes.length)];
  const newState = move(randomIndex, prevGame);
  return newState;
}

export function move(position: number, prevGame: GameState): GameState {
  const newGame: GameState = { ...prevGame, Board: [...prevGame.Board] };

  // check how it is possible to win
  const wins: Wins = calculateWins(newGame.Size);

  // check if the move is valid at all
  if (prevGame.Board[position] !== "") {
    return {
      ...newGame,
      InterruptionMessage: "You done messed up, A-A-Ron!",
    };
  }

  // update the board state
  else {
    newGame.Board[position] = prevGame.Player;
  }

  // check if anybody has won
  const winOutcome: Player | undefined = checkWin(
    newGame.Board,
    prevGame.Player,
    wins,
  );
  if (winOutcome !== undefined) {
    return {
      ...newGame,
      InterruptionMessage: `${winOutcome} has won the game!`,
    };
  }

  // check if the game is a tie
  if (!newGame.Board.includes("")) {
    return {
      ...newGame,

      InterruptionMessage: "Tie game. Try being dumber next time.",
    };
  }

  // otherwise, go to the next move
  const newPlayer: Player = changePlayer(prevGame.Player);
  return { ...newGame, Player: newPlayer } as GameState;
}

// function resetGame()
