import { EntityManager } from 'typeorm';

export type Context = {
  em: EntityManager;
};
