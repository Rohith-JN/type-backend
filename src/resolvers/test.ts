import { Test } from '../entities/test';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../types';

@Resolver()
export class TestResolver {
  @Query(() => [Test])
  tests(@Ctx() ctx: Context): Promise<Test[]> {
    return ctx.em.find(Test, {});
  }

  @Query(() => Test, { nullable: true })
  test(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: Context
  ): Promise<Test | null> {
    return ctx.em.findOne(Test, { id });
  }

  @Mutation(() => Test)
  async createTest(
    @Ctx() ctx: Context,
    @Arg('time') time: string,
    @Arg('accuracy') accuracy: string,
    @Arg('wpm') wpm: number,
    @Arg('words') words: string
  ): Promise<Test> {
    const test = ctx.em.create(Test, { time, accuracy, wpm, words });
    await ctx.em.persistAndFlush(test);
    return test;
  }
}
