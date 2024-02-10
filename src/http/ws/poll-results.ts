import z from "zod";
import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:id/results",
    { websocket: true },
    async (connection, request) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      const { id } = getPollParams.parse(request.params);

      voting.subscribe(id, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
