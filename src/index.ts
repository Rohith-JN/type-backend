import 'reflect-metadata';
import express from 'express';
import { __prod__ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TestResolver } from './resolvers/test';
import { UserResolver } from './resolvers/user';
import { AppDataSource } from './data-source';

const main = async () => {
  const app = express();
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: AppDataSource.manager }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
  console.log(err);
});
