import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TestResolver } from './resolvers/test';
import { UserResolver } from './resolvers/user';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const app = express();
  app.listen(process.env.PORT, () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, UserResolver],
      validate: false,
    }),
    persistedQueries: false,
    introspection: false,
    context: () => ({ em: AppDataSource.manager }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
  console.log(err);
});
