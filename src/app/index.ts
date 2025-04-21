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
        sayHelloToMe(name: String!): String
      }
    `,
    resolvers: {
      Query: {
        sayHello: () => `Hello from graphql server`,
        sayHelloToMe: (parent: any, {name}: {name: string}) => {
          return `Hey ${name}`
        }
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