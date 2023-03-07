import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';

export type Context = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
