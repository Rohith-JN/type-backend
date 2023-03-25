import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class Test {
  [OptionalProps]?: 'updatedAt' | 'createdAt';

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field()
  @Property({ type: 'text' })
  title!: string;
}
