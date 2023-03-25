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
class Username {
  @Field()
  username: string;
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
  async register(@Ctx() ctx: Context, @Arg('options') options: Username) {
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

    const user = ctx.em.create(User, {
      username: options.username,
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
}
