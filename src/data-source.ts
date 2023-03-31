import { DataSource } from 'typeorm';
import { Test } from './entities/test';
import { User } from './entities/user';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../.development.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'type-io',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  logging: true,
  synchronize: true,
  entities: [Test, User],
  migrations: [path.join(__dirname, './migrations/*')],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
