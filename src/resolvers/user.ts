import { User } from '../entities/user';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Context } from '../types';
import { Options } from '../utils/InputTypes';
import { validate } from '../utils/validate';
import { FieldError, UserResponse } from '../utils/objectTypes';

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(@Ctx() ctx: Context, @Arg('options') options: Options) {
    try {
      const user = ctx.em
        .create(User, {
          username: options.username,
          email: options.email,
          uid: options.uid,
        })
        .save();
      return { user };
    } catch (err) {
      return {
        error: [{ field: 'general', message: 'Unknown error occurred.' }],
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
    const errors = validate({
      username,
      email,
      password,
    });
    if (errors) {
      return errors;
    }

    const usernameExists = await ctx.em.findOneBy(User, { username: username });
    const emailExists = await ctx.em.findOneBy(User, { email: email });

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
