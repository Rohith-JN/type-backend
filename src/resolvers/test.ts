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
    @Arg('title') title: string
  ): Promise<Test> {
    const test = ctx.em.create(Test, { title });
    await ctx.em.persistAndFlush(test);
    return test;
  }

  @Mutation(() => Test, { nullable: true })
  async updateTest(
    @Ctx() ctx: Context,
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Test | null> {
    const test = await ctx.em.findOne(Test, { id });
    if (!test) {
      return null;
    }
    if (typeof title !== undefined) {
      test.title = title;
      await ctx.em.persistAndFlush(test);
    }
    return test;
  }

  @Mutation(() => Test, { nullable: true })
  async deleteTest(
    @Ctx() ctx: Context,
    @Arg('id') id: number
  ): Promise<boolean> {
    await ctx.em.nativeDelete(Test, { id });
    return true;
  }
}
