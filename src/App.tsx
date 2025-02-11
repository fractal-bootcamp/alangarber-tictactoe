import { useState, useRef, useEffect } from "react";
import { treaty } from "@elysiajs/eden";
import { EdenWS } from "@elysiajs/eden/treaty";
import type { ApiApp } from "../index";
import {
  Cell,
  GameState,
  move,
  initialBoardState,
  initialGameState,
} from "../game-logic/tictactoe";
import "./App.css";

const api = treaty<ApiApp>("localhost:3000");

type MyWS = EdenWS<{
  body: { position: number, size: number };
  params: {};
  query: { gameId: string };
  headers: unknown;
  response: unknown;
}>;

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const gameServerRef = useRef<MyWS | null>(null);

  useEffect(() => {
    const gameServer = api.game.subscribe({ query: { gameId: "2" } });
    gameServerRef.current = gameServer;

    gameServer.subscribe((message) => {
      console.log("setGame to:", message);
      if (message.data.error === "Not your turn") {
        alert("Not your turn");
      } else {
        if (message.data.game) {
          setGameState(message.data.game);
        }
      }
    });

    return () => {
      gameServer.close();
      gameServerRef.current = null;
    };
  }, []);

  function startTheGame(size: number) {
    gameServerRef.current?.send({ position: null, size: size});
    // setGameState({
    //   ...gameState,
    //   Board: initialBoardState(size),
    //   Size: size,
    //   Start: true,
    // });
  }

  function handleClick(index: number, gameState: GameState) {
    console.log("gameState:", gameState);
    gameServerRef.current?.send({ position: index, size: gameState.Board.length });
    // setGameState(move(index, gameState));
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
            <div>
              <div className="flex justify-center">
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
                      setGameState({ ...gameState, Size: gameState.Size - 1 });
                    }
                  }}
                >
                  Decrement Grid Size
                </button>
              </div>
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer">
                  Play Against Myself
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer">
                  Play Against AI
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer">
                  Play Against My Friend
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => startTheGame(gameState.Size)}
                >
                  Start the Game
                </button>
              </div>
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
