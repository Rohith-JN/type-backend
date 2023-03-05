import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Todo {
  [OptionalProps]?: 'updatedAt' | 'createdAt';

  @PrimaryKey()
  id!: number;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();

  @Property({ type: 'text' })
  title!: string;
}
