import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import config from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(config);
};

main().catch((err) => {
  console.log(err);
});
