import z from "zod";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";

export async function VoteOnPoll(app: FastifyInstance) {
  app.post("/polls/:id/votes", async (request, response) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string(),
    });

    const voteOnPollParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          pollId_sessionId: {
            pollId: id,
            sessionId,
          },
        },
      });

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        });

        const votes = await redis.zincrby(
          id,
          -1,
          userPreviousVoteOnPoll.pollOptionId
        );

        voting.publish(id, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes),
        });
      } else if (userPreviousVoteOnPoll) {
        return response.status(400).send({
          message: "You have already voted on this poll.",
        });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      response.setCookie("sessionId", sessionId, {
        httpOnly: true,
        signed: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId: id,
        pollOptionId,
      },
    });

    const votes = await redis.zincrby(id, 1, pollOptionId);

    voting.publish(id, {
      pollOptionId,
      votes: Number(votes),
    });

    return response.status(201).send();
  });
}
