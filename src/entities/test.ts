import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Float } from 'type-graphql';
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

  @Field(() => Float)
  @Column('double precision')
  accuracy: number;

  @Field()
  @Column()
  wpm: number;

  @Field()
  @Column()
  rawWpm: number;

  @Field()
  @Column()
  chars: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  testTaken: string;

  @Field(() => [String])
  @Column('text', { array: true })
  typedWordDataset: string[];

  @Field(() => [Number])
  @Column('int', { array: true })
  wordNumberLabels: number[];

  @Field(() => [Number])
  @Column('int', { array: true })
  wpmDataset: number[];

  @Field(() => [Number])
  @Column('int', { array: true })
  incorrectCharsDataset: number[];
}
