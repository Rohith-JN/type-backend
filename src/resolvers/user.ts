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
    try {
      const user = ctx.em
        .create(User, {
          username: options.username,
          email: options.email,
          password: options.password,
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
    const errors = validateRegister({
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

  @Mutation(() => FieldError)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    if (!email.includes('@')) {
      return {
        field: 'email',
        message: 'Invalid email format',
      };
    }

    if (password.length <= 2) {
      return {
        field: 'password',
        message: 'Password length must be greater than 2',
      };
    } else return {};
  }

  @Mutation(() => UserResponse)
  async user(@Ctx() ctx: Context, @Arg('uid') uid: string) {
    const user = await ctx.em.findOneBy(User, { uid: uid });
    if (user) {
      return { user };
    } else
      return {
        error: [{ field: 'general', message: 'Could not get user' }],
        user: null,
      };
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Ctx() ctx: Context,
    @Arg('id') id: number,
    @Arg('uid') uid: string
  ): Promise<Boolean> {
    await ctx.em.delete(User, { id, uid });
    return true;
  }
}
