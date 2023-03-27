import { User } from '../entities/user';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Context } from '../types';
import { Options } from './options';
import { validateRegister } from '../utils/validate';

@ObjectType()
class FieldError {
  @Field(() => String, { nullable: true })
  field: string;

  @Field(() => String, { nullable: true })
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
  async register(@Ctx() ctx: Context, @Arg('options') options: Options) {
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
        error: [{ field: 'general', message: 'unknown error occurred.' }],
        user: null,
      };
    }
  }

  @Mutation(() => FieldError)
  async validate(
    @Ctx() ctx: Context,
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const errors = validateRegister({
      username,
      email,
      password,
    });
    if (errors) {
      return errors;
    }

    const usernameExists = await ctx.em.findOne(User, { username: username });
    const emailExists = await ctx.em.findOne(User, { email: email });

    if (usernameExists) {
      return {
        field: 'username',
        message: 'Username already taken',
      };
    } else if (emailExists) {
      return {
        field: 'email',
        message: 'Email already in use',
      };
    } else return {};
  }
}
