import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { __prod__ } from './constants';
import config from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TodoResolver } from './resolvers/todo';

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  const app = express();
  app.listen(3000, () => {
    console.log('Server started on localhost:3000');
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TodoResolver],
      validate: false,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
  console.log(err);
});
