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
import argon2 from 'argon2';

@InputType()
class UsernamePassword {
  @Field()
  username: string;

  @Field()
  password: string;
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
  async register(
    @Ctx() ctx: Context,
    @Arg('options') options: UsernamePassword
  ) {
    if (options.username.length <= 2) {
      return {
        error: [
          {
            field: 'username',
            message: 'length must be greater than 2',
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        error: [
          {
            field: 'password',
            message: 'length must be greater than 3',
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = ctx.em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await ctx.em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        return {
          error: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() ctx: Context,
    @Arg('options') options: UsernamePassword
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, { username: options.username });
    if (!user) {
      return {
        error: [
          {
            field: 'username',
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        error: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }
    return {
      user,
    };
  }
}
