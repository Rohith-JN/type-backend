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
  @Property({ type: 'varchar' })
  time: string;

  @Field()
  @Property({ type: 'varchar' })
  accuracy: string;

  @Field()
  @Property({ type: 'number' })
  wpm: number;

  @Field()
  @Property({ type: 'text' })
  words: string;
}
