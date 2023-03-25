import { Options } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Todo } from './entities/test';
import path from 'path';
import { User } from './entities/user';
import * as dotenv from 'dotenv';

dotenv.config();
const config: Options = {
  migrations: {
    glob: '!(*.d).{js,ts}',
    path: path.join(__dirname, './migrations'),
  },
  entities: [Todo, User],
  dbName: 'tasks',
  user: process.env.DATABASE_USERNAME,
  type: 'postgresql',
  password: process.env.DATABASE_PASSWORD,
  debug: !__prod__,
};

export default config;
