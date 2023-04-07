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
