import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'updatedAt' | 'createdAt';

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;
}
