import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TestResolver } from './resolvers/test';
import { UserResolver } from './resolvers/user';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import { __prod__ } from './constants';
import cors from 'cors';

dotenv.config();

const main = async () => {
  const app = express();
  app.set('trust proxy', true);

  app.use(
    cors({
      origin: __prod__
        ? process.env.CORS_ORIGIN
        : [
            'https://studio.apollographql.com',
            'http://localhost:4000/graphql',
            process.env.CORS_ORIGIN!,
          ],
      credentials: true,
    })
  );
  app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, UserResolver],
      validate: false,
    }),
    persistedQueries: false,
    introspection: __prod__ ? false : true,
    context: () => ({ em: AppDataSource.manager }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: true,
  });
};

main().catch((err) => {
  console.log(err);
});
