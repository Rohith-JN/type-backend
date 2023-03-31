import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class Test extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

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
