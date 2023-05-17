import { Field, InputType } from 'type-graphql';

@InputType()
export class Options {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  uid: string;
}

@InputType()
export class TestOptions {
  @Field()
  uid: string;

  @Field()
  time: string;

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

  @Field(() => [String])
  typedWordDataset: string[];

  @Field(() => [Number])
  wordNumberLabels: number[];

  @Field(() => [Number])
  wpmDataset: number[];

  @Field(() => [Number])
  incorrectCharsDataset: number[];
}