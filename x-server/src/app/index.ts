import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { query } from 'express';
import bodyParser from 'body-parser';
import {user} from './user/index'
import cors from 'cors'

export const initServer = async()=>{
    const app = express();
    app.use(cors(
      {
      origin: 'http://localhost:3000'
      }
    ))
    app.use(bodyParser.json());
    const server = new ApolloServer({
      typeDefs: `
      ${user.types}
      type Query{
        ${user.queries}
      }
     `,
      resolvers: {
          Query:{
           ...user.resolver.queries
          },
      },
    });
    
    await server.start();
    app.use("/graphql",expressMiddleware(server));
    return app;
}