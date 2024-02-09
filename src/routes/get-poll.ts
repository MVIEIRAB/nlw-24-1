import z from "zod";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:id", async (request, response) => {
    const getPollParams = z.object({
      id: z.string(),
    });

    const { id } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        PollOption: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return response.send(poll);
  });
}
