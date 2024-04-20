import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { query } from "express";
import bodyParser from "body-parser";
import { user } from "./user/index";
import cors from "cors";
import { decodeToken } from "../services/jwt";
import { Tweet } from "./tweet";

export const initServer = async () => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  app.use(bodyParser.json());
  const server = new ApolloServer({
    typeDefs: `
      ${user.types}
      ${Tweet.types}
      type Query{
        ${user.queries}
        ${Tweet.queries}
      }
      type Mutation{
        ${Tweet.mutation}
        ${user.mutation}
      }
     `,
    resolvers: {
      Query: {
        ...user.resolver.queries,
        ...Tweet.resolver.queries,
      },
      Mutation:{
        ...Tweet.resolver.mutation,
        ...user.resolver.mutation,
      },
      ...user.resolver.extraResolver,
      ...Tweet.resolver.extraResolver,
    },
  });

  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      //the third perameter of the query is this context
      context: async ({ req, res }) => {
        const JWTtoken = req.headers.__token?.slice(7) as string
         return {
          User: req.headers.__token
            ? await decodeToken(JWTtoken)
            : undefined,
        };
      },
    })
  );
  return app;
};
