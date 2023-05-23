import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/user';
import { Test } from './entities/test';
import { __prod__ } from './constants';
import { migration1684564075219 } from './migrations/1684564075219-migration';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: __prod__ ? 'database' : 'localhost',
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,
  synchronize: false,
  cache: false,
  entities: [Test, User],
  migrations: __prod__ ? [migration1684564075219] : [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    __prod__ ? AppDataSource.runMigrations() : null;
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
