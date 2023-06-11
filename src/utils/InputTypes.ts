import { Field, InputType } from 'type-graphql';

@InputType()
export class Options {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  uid: string;
}

@InputType()
export class TestOptions {
  @Field()
  uid: string;

  @Field()
  time: number;

  @Field()
  accuracy: number;

  @Field()
  wpm: number;

  @Field()
  rawWpm: number;

  @Field()
  chars: string;

  @Field()
  testTaken: string;
}
