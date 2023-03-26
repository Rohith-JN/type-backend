import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { __prod__ } from './constants';
import config from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TestResolver } from './resolvers/test';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  const app = express();
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em.fork() }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
  console.log(err);
});
