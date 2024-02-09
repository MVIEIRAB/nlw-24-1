import z from "zod";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, response) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        PollOption: {
          createMany: {
            data: options.map((option) => ({
              title: option,
            })),
          },
        },
      },
    });

    return response.status(201).send({ pollId: poll.id });
  });
}
