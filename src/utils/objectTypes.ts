import { Test } from 'src/entities/test';
import { User } from 'src/entities/user';
import { Field, ObjectType } from 'type-graphql';

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
export class PaginatedTests {
  @Field(() => [Test])
  tests: Test[];

  @Field()
  hasMore: boolean;
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
  time: string;

  @Field()
  testTaken: number;
}

@ObjectType()
export class LeaderBoard {
  @Field(() => [LeaderBoardStatFields])
  leaderBoard: LeaderBoardStatFields[];
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
  testsTaken: number;
}

@ObjectType()
export class UserStats {
  @Field(() => [UserStatFields])
  userStats: UserStatFields[];
}
