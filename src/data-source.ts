import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/user';
import { Test } from './entities/test';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'type-io',
  username: process.env.DATABASE_USERNAME?.toString(),
  password: process.env.DATABASE_PASSWORD?.toString(),
  logging: true,
  synchronize: false,
  cache: false,
  entities: [Test, User],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
