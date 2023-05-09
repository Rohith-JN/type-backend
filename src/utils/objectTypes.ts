import { Test } from '../entities/test';
import { User } from '../entities/user';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Tests {
  @Field(() => [Number])
  wpmData: number[];

  @Field(() => [Number])
  accuracyData: number[];

  @Field(() => [Number])
  labels: number[];

  @Field(() => [String])
  testTaken: string[];
}

@ObjectType()
class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => String)
  endCursor: string;
}

@ObjectType()
export class PaginatedTests {
  @Field(() => [Test])
  tests: Test[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class FieldError {
  @Field(() => String, { nullable: true })
  field: string;

  @Field(() => String, { nullable: true })
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class UserStatFields {
  @Field()
  time: string;

  @Field()
  wpm: number;

  @Field()
  pb: number;

  @Field()
  accuracy: string;

  @Field()
  recentWpm: number;

  @Field()
  recentAccuracy: string;

  @Field()
  testsTaken: number;
}

@ObjectType()
export class UserStats {
  @Field(() => [UserStatFields])
  userStats: UserStatFields[];
}

@ObjectType()
class LeaderBoardStatFields {
  @Field()
  rank: number;

  @Field()
  user: string;

  @Field()
  wpm: number;

  @Field()
  accuracy: number;

  @Field()
  testTaken: string;
}

@ObjectType()
export class LeaderBoard {
  @Field(() => [LeaderBoardStatFields])
  leaderBoard: LeaderBoardStatFields[];

  @Field(() => LeaderBoardStatFields)
  user: LeaderBoardStatFields; 
}