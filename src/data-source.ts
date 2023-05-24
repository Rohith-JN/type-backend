import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/user';
import { Test } from './entities/test';
import { __prod__ } from './constants';
import { migration1684564075219 } from './migrations/1684564075219-migration';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: __prod__ ? process.env.PGHOST : 'localhost',
  port: __prod__ ? parseInt(process.env.PGPORT!) : 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
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
