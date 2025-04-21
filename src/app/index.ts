import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
// import cors from "cors";

export async function initServer() {
  const app = express();
  
  app.use(express.json());
  
  
  // 3. Initialize and start the Apollo server
  const graphqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        sayHello: String
      }
    `,
    resolvers: {
      Query: {
        sayHello: () => `Hello from graphql server`
      }
    },
    introspection: true
  });
  await graphqlServer.start();
  
  app.use(
    "/graphql",
    //@ts-ignore
    expressMiddleware(graphqlServer)
  );
  
  return app;
}