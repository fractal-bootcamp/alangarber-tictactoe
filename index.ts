import { Elysia, t } from "elysia";
import { move } from "./game-logic/tictactoe";
import {
  createOrJoinGame,
  getCurrentPlayer,
  getGame,
  leaveGame,
} from "./game-logic/multiplayer";
import { ElysiaWS } from "elysia/ws";

const websockets = new Map<string, ElysiaWS>();

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/user/:id", ({ params: { id } }) => id)
  .post("/form", ({ body }) => body)
  .ws("/game", {
    body: t.Object({
      position: t.Number(),
      size: t.Number(),
    }),
    query: t.Object({
      gameId: t.String(),
    }),
    open(ws) {
      websockets.set(ws.id, ws);

      const gameId = ws.data.query.gameId;
      console.log("gameId:", gameId);

      const result = createOrJoinGame(gameId, ws.id);
      console.log("result:", result);

      ws.send({
        role: result.role,
        game: result.game.gameState,
        time: Date.now(),
      });
    },
    close(ws) {
      leaveGame(ws.id);
      websockets.delete(ws.id);
    },
    message(ws, message) {
      console.log("message:", message);

      const gameId = getGame(ws.id);
      if (!gameId) { 
        ws.send({ error: "Game not found" }); 
        return;
      }

      const game = getGame(ws.id);
      console.log("game:", game);

      if (!game) {
        ws.send({ error: "Game not found" });
        return;
      }
      
    //   if (!ws.body || typeof ws.body.position !== "number") {
    //     ws.send({ error: "Invalid position" });
    //     return;
    //   }

    //   const player = getCurrentPlayer(game, ws.id);
    //   console.log("currentPlayer:", player)
    //   if (!player) {
    //     ws.send({ error: "Not a player in this game" });
    //     return;
    //   }

    //   if (game.gameState.Player !== player.toLowerCase()) {
    //     ws.send({ error: "Not your turn" });
    //     return;
    //   }

      game.gameState = move(ws.body.position, game.gameState);

      game.connectionIds.forEach((connectionId) => {
        const client = websockets.get(connectionId);
        if (client) {
          client.send({
            game: game.gameState,
            time: Date.now(),
          });
        }
      });
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type ApiApp = typeof app;
