import fastify from "fastify";
import cookie from "@fastify/cookie";

import { createPoll } from "../routes/create-poll";
import { getPoll } from "../routes/get-poll";
import { VoteOnPoll } from "../routes/vote-on-poll";

const server = fastify();

server.register(cookie, {
  secret: "supersecret",
});

server.register(createPoll);
server.register(getPoll);
server.register(VoteOnPoll);

server.listen({ port: 3000 }).then(() => console.log("Running..."));
