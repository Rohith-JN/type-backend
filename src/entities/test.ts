import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './user';

@ObjectType()
@Entity()
export class Test extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.tests)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'uid' })
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
  chars: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}
