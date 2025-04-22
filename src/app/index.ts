import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { User } from './user'

export async function initServer() {
  const app = express();

  app.use(express.json());


  const graphqlServer = new ApolloServer({
    typeDefs: `
      ${User.types}
      type Query {
        ${User.queries}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      }
    },
  });
  await graphqlServer.start();

  app.use(
    "/graphql",
    //@ts-ignore
    expressMiddleware(graphqlServer)
  );

  return app;
}