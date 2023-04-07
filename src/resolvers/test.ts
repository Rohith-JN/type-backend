import { Test } from '../entities/test';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../types';
import { LeaderBoard, PaginatedTests, UserStats } from '../utils/objectTypes';

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
    @Arg('chars') chars: string,
    @Arg('testTaken') testTaken: string
  ): Promise<Test> {
    return await ctx.em
      .create(Test, {
        creatorId: uid,
        time: time,
        accuracy: accuracy,
        wpm: wpm,
        chars: chars,
        testTaken: testTaken,
      })
      .save();
  }

  @Query(() => UserStats)
  async getStats(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string
  ): Promise<UserStats> {
    const times = ['15', '30', '45', '60', '120'];
    let userStats = [];

    for (let i = 0; i < times.length; i++) {
      const tests = await ctx.em
        .createQueryBuilder(Test, 'test')
        .where('test.creatorId = :id', { id: uid })
        .andWhere('test.time = :time', { time: times[i] })
        .orderBy('test.createdAt', 'DESC')
        .getMany();

      let wpm = 0;
      let accuracy = 0;
      let wpmList: number[] = [];

      tests.forEach((test) => {
        wpm = wpm + test.wpm;
        accuracy = accuracy + parseInt(test.accuracy.replace('%', ''));
        wpmList.push(test.wpm);
      });

      const finalWpm = Math.round(wpm / tests.length);
      const finalAccuracy = Math.round(accuracy / tests.length);
      const pb = wpmList.length > 0 ? Math.max(...wpmList) : 0;

      userStats.push({
        time: times[i],
        wpm: finalWpm ? finalWpm : 0,
        pb: pb,
        accuracy: !Number.isNaN(finalAccuracy) ? `${finalAccuracy}%` : '0%',
        testsTaken: tests.length,
      });
    }

    return {
      userStats,
    };
  }

  @Query(() => LeaderBoard)
  async leaderboard(
    @Ctx() ctx: Context,
    @Arg('time') time: string
  ): Promise<LeaderBoard> {
    const tests = await ctx.em
      .createQueryBuilder(Test, 'test')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('MAX(t.wpm)', 'max_wpm')
            .addSelect('t.creatorId', 'creatorId')
            .from(Test, 't')
            .where('t.time = :time', { time: time })
            .groupBy('t.creatorId'),
        'max_tests',
        'max_tests.max_wpm = test.wpm AND max_tests."creatorId" = test."creatorId"'
      )
      .leftJoinAndSelect('test.creator', 'creator')
      .where('test.time = :time', { time: time })
      .orderBy('test.wpm', 'DESC')
      .limit(50)
      .getMany();

    let leaderBoard = [];
    for (let i = 0; i < tests.length; i++) {
      leaderBoard.push({
        rank: i + 1,
        user: tests[i].creator.username,
        wpm: tests[i].wpm,
        accuracy: tests[i].accuracy,
        time: time,
        testTaken: tests[i].testTaken,
      });
    }
    return {
      leaderBoard,
    };
  }
}
