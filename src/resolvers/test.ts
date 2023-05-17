import { Test } from '../entities/test';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../types';
import {
  LeaderBoard,
  PaginatedTests,
  Tests,
  UserStats,
} from '../utils/objectTypes';
import { TestOptions } from '../utils/InputTypes';

@Resolver()
export class TestResolver {
  @Query(() => Test)
  async test(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string,
    @Arg('id') id: number
  ): Promise<Test | null> {
    const test = ctx.em.findOneBy(Test, { id: id, creatorId: uid });
    return test;
  }

  @Query(() => Tests)
  async tests(@Ctx() ctx: Context, @Arg('uid') uid: string): Promise<Tests> {
    const qb = ctx.em
      .createQueryBuilder(Test, 'test')
      .where('test.creatorId = :id', { id: uid })
      .orderBy('"createdAt"', 'DESC');
    const tests = await qb.getMany();
    let wpmData: number[] = [];
    let accuracyData: number[] = [];
    let labels: number[] = [];
    let testTaken: string[] = [];
    tests.forEach((test, index) => {
      wpmData.push(test.wpm);
      accuracyData.push(test.accuracy);
      labels.push(index + 1);
      testTaken.push(test.testTaken);
    });
    return {
      wpmData: wpmData.reverse(),
      accuracyData: accuracyData.reverse(),
      labels: labels,
      testTaken: testTaken.reverse(),
    };
  }

  @Query(() => PaginatedTests)
  async paginatedTests(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string,
    @Arg('first', () => Int) first: number,
    @Arg('after', { nullable: true }) after?: string
  ): Promise<PaginatedTests> {
    const realLimit = Math.min(50, first);
    const qb = ctx.em
      .createQueryBuilder(Test, 'test')
      .where('test.creatorId = :id', { id: uid })
      .orderBy('"createdAt"', 'DESC');

    if (after) {
      const cursorDate = new Date(parseInt(after));
      qb.andWhere('"createdAt" < :cursor', { cursor: cursorDate });
    }

    const tests = await qb.take(realLimit + 1).getMany();
    const hasMore = tests.length === realLimit + 1;
    const endCursor =
      tests[tests.length - 2]?.createdAt.getTime().toString() ?? '';

    return {
      tests: tests.slice(0, realLimit),
      pageInfo: {
        hasNextPage: hasMore,
        endCursor: endCursor.toString(),
      },
    };
  }

  @Mutation(() => Test)
  async createTest(
    @Ctx() ctx: Context,
    @Arg('testOptions') testOptions: TestOptions
  ): Promise<Test> {
    return await ctx.em
      .create(Test, {
        creatorId: testOptions.uid,
        time: testOptions.time,
        accuracy: testOptions.accuracy,
        wpm: testOptions.wpm,
        rawWpm: testOptions.rawWpm,
        chars: testOptions.chars,
        testTaken: testOptions.testTaken,
        typedWordDataset: testOptions.typedWordDataset,
        wordNumberLabels: testOptions.wordNumberLabels,
        wpmDataset: testOptions.wpmDataset,
        incorrectCharsDataset: testOptions.incorrectCharsDataset,
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
      const qb = ctx.em
        .createQueryBuilder(Test, 'test')
        .where('test.creatorId = :id', { id: uid })
        .andWhere('test.time = :time', { time: times[i] })
        .orderBy('test.createdAt', 'DESC');

      const tests = await qb.getMany();
      const recentTests = tests.slice(0, 10);
      let recentWpm = 0;
      let recentAccuracy = 0;
      let wpm = 0;
      let accuracy = 0;
      let wpmList: number[] = [];
      const length = tests.length;

      tests.forEach((test) => {
        wpm = wpm + test.wpm;
        accuracy = accuracy + test.accuracy;
        wpmList.push(test.wpm);
      });
      if (recentTests.length >= 10) {
        recentTests.forEach((test) => {
          recentWpm = recentWpm + test.wpm;
          recentAccuracy = recentAccuracy + test.accuracy;
        });
      }
      const finalRecentWpm = Math.round(recentWpm / 10);
      const finalRecentAccuracy = Math.round(recentAccuracy / 10);
      const finalWpm = Math.round(wpm / length);
      const finalAccuracy = Math.round(accuracy / length);
      const pb = wpmList.length > 0 ? Math.max(...wpmList) : 0;

      userStats.push({
        time: times[i],
        wpm: finalWpm ? finalWpm : 0,
        pb: pb,
        accuracy: !Number.isNaN(finalAccuracy) ? `${finalAccuracy}%` : '0%',
        recentWpm: finalRecentWpm ? finalRecentWpm : 0,
        recentAccuracy: !Number.isNaN(finalRecentAccuracy)
          ? `${finalRecentAccuracy}%`
          : '0%',
        testsTaken: length,
      });
    }

    return {
      userStats,
    };
  }

  @Query(() => LeaderBoard)
  async leaderboard(
    @Ctx() ctx: Context,
    @Arg('uid') uid: string
  ): Promise<LeaderBoard> {
    const qb = ctx.em
      .createQueryBuilder(Test, 'test')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('MAX(t.wpm)', 'max_wpm')
            .addSelect('t.creatorId', 'creatorId')
            .from(Test, 't')
            .where('t.time = :time', { time: '60' })
            .groupBy('t.creatorId'),
        'max_tests',
        'max_tests.max_wpm = test.wpm AND max_tests."creatorId" = test."creatorId"'
      )
      .where('test.time = :time', { time: '60' })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(t2.accuracy)')
          .from(Test, 't2')
          .where('t2.time = :time')
          .andWhere('t2.wpm = test.wpm')
          .andWhere('t2.creatorId = test.creatorId')
          .setParameter('time', '60')
          .getQuery();
        return `test.accuracy = (${subQuery})`;
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MIN(t3.createdAt)')
          .from(Test, 't3')
          .where('t3.creatorId = test.creatorId')
          .andWhere('t3.wpm = test.wpm')
          .andWhere('t3.accuracy = test.accuracy')
          .setParameter('time', '60')
          .getQuery();
        return `test."createdAt" = (${subQuery})`;
      })
      .leftJoinAndSelect('test.creator', 'creator')
      .orderBy('test.wpm', 'DESC')
      .addOrderBy('test.accuracy', 'DESC')
      .addOrderBy('test.createdAt', 'ASC');

    const tests = await qb.getMany();
    let userRank: number = -1;
    let userName: string = '';
    let userWpm: number = 0;
    let userAccuracy: number = 0;
    let testTaken: string = '';

    let leaderBoard = [];

    let prevWpm = Infinity;
    let prevAccuracy = 0;
    let rank = 0;

    for (let i = 0; i < tests.length; i++) {
      const { wpm, accuracy } = tests[i];

      if (wpm < prevWpm || (wpm === prevWpm && accuracy > prevAccuracy)) {
        rank = i + 1;
        prevWpm = wpm;
        prevAccuracy = accuracy;
      } else {
        rank += 1;
      }

      leaderBoard.push({
        rank,
        user: tests[i].creator.username,
        wpm: wpm,
        accuracy: accuracy,
        testTaken: tests[i].testTaken,
      });

      if (tests[i].creatorId === uid) {
        userRank = rank;
        userName = tests[i].creator.username;
        userWpm = tests[i].wpm;
        userAccuracy = tests[i].accuracy;
        testTaken = tests[i].testTaken;
      }
    }
    // change slice end no to whatever number of tests have to be shown
    leaderBoard = leaderBoard.slice(0, 50);

    return {
      leaderBoard,
      user: {
        rank: userRank,
        user: userName,
        wpm: userWpm,
        accuracy: userAccuracy,
        testTaken: testTaken,
      },
    };
  }
}
