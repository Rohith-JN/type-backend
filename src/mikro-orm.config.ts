import { Options } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Todo } from './entities/todo';
import path from 'path';

const config: Options = {
  migrations: {
    glob: '!(*.d).{js,ts}',
    path: path.join(__dirname, './migrations'),
  },
  entities: [Todo],
  dbName: 'tasks',
  user: process.env.USERNAME,
  type: 'postgresql',
  password: process.env.PASSWORD,
  debug: !__prod__,
};

export default config;
