import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './user';

@ObjectType()
@Entity()
export class Test extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.tests)
  creator: User;

  @Field()
  @Column()
  time: string;

  @Field()
  @Column()
  accuracy: string;

  @Field()
  @Column()
  wpm: number;

  @Field()
  @Column()
  words: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}
