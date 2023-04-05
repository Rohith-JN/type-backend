import { Test } from '../entities/test';
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Context } from '../types';

@ObjectType()
class PaginatedTests {
  @Field(() => [Test])
  tests: Test[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class TestResolver {
  @Query(() => PaginatedTests)
  async tests(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedTests> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = ctx.em
      .createQueryBuilder(Test, 'test')
      .where('test.creatorId = :id', { id: uid })
      .orderBy('"createdAt"', 'DESC')
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    const tests = await qb.getMany();

    return {
      tests: tests.slice(0, realLimit),
      hasMore: tests.length === realLimitPlusOne,
    };
  }

  @Mutation(() => Test)
  async createTest(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string,
    @Arg('time') time: string,
    @Arg('accuracy') accuracy: string,
    @Arg('wpm') wpm: number,
    @Arg('chars') chars: string
  ): Promise<Test> {
    return await ctx.em
      .create(Test, {
        creatorId: uid,
        time: time,
        accuracy: accuracy,
        wpm: wpm,
        chars: chars,
      })
      .save();
  }
}
