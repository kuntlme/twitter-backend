import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { User } from './user'
import { Tweet } from "./tweet";
import cors from "cors"
import { GraphqlContext } from "../interfaces";
import { decodeTokenForUser } from "../services/jwt";

export async function initServer() {
  const app = express();

  app.use(cors())
  app.use(express.json());


  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.types}
      ${Tweet.types}
      type Query {
        ${User.queries},
        ${Tweet.queries},
      }

      type Mutation {
        ${Tweet.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },

      Mutation: {
        ...Tweet.resolvers.mutations,
      },

      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
    },
  });
  await graphqlServer.start();

  app.use(
    "/graphql",
    //@ts-ignore
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization ? decodeTokenForUser(req.headers.authorization) : undefined
        }
      }
    })
  );

  return app;
}