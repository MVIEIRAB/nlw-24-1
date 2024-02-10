import z from "zod";
import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:id", async (request, response) => {
    const getPollParams = z.object({
      id: z.string(),
    });

    const { id } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) {
      return response.status(404).send({ message: "Poll not found." });
    }

    const result = await redis.zrange(id, 0, -1, "WITHSCORES");

    const votes = result.reduce((object, row, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];
        Object.assign(object, { [row]: Number(score) });
      }

      return object;
    }, {} as Record<string, number>);

    return response.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => ({
          id: option.id,
          title: option.title,
          votes: votes[option.id] || 0,
        })),
      },
    });
  });
}
