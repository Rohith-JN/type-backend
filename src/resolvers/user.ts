import { User } from '../entities/user';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { Context } from '../types';

@InputType()
class InputFields {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  uid: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(@Ctx() ctx: Context, @Arg('options') options: InputFields) {
    const user = ctx.em.create(User, {
      username: options.username,
      email: options.email,
      password: options.password,
      uid: options.uid,
    });
    try {
      await ctx.em.persistAndFlush(user);
      return { user };
    } catch (err) {
      return {
        error: [{ field: 'unknown', message: 'Unknown error occurred.' }],
        user: null,
      };
    }
  }
}
