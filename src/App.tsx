import {
  Cell,
  GameState,
  move,
  initialBoardState,
  initialGameState,
} from "../game-logic/tictactoe";
import { useState } from "react";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState(initialGameState);

  function startTheGame(size: number) {
    setGameState({
      ...gameState,
      Board: initialBoardState(size),
      Size: size,
      Start: true,
    });
  }

  function handleClick(index: number, gameState: GameState) {
    setGameState(move(index, gameState));
  }

  function resetGame() {
    setGameState(initialGameState);
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        <div className="text-[50px] font-bold text-center bg-gray-100 shadow-md">
          Tic-Tac-Toe Game
        </div>
        <div className="text-[25px] font-bold text-center bg-gray-100 shadow-md">
          Grid Size: {gameState.Size}
          {!gameState.Start && (
            <div className="flex">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() =>
                  setGameState({ ...gameState, Size: gameState.Size + 1 })
                }
              >
                Increment Grid Size
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() => {
                  if (gameState.Size > 0) {
                  setGameState({ ...gameState, Size: gameState.Size - 1 })
                  }
                }
              }
              >
                Decrement Grid Size
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() => startTheGame(gameState.Size)}
              >
                Start the Game
              </button>
            </div>
          )}
        </div>
        {gameState.Start && (
          <div className="flex-1 flex justify-center items-center mt-[60px]">
            {gameState.Interruption ? (
              <>
                <div className="text-center">
                  <div className="text-[50px] mb-4">
                    {gameState.InterruptionMessage}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => resetGame()}
                    >
                      Play Again
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Brag About It
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`grid gap-2 w-[300px]`}
                style={{
                  gridTemplateColumns: `repeat(${gameState.Size}, minmax(0, 1fr))`,
                }}
              >
                {gameState.Board.map((cell: Cell, index: number) => (
                  <button
                    key={index}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold flex items-center justify-center aspect-square text-2xl rounded cursor-pointer px-4 py-4"
                    onClick={() => handleClick(index, gameState)}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
