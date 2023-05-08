import { Test } from '../entities/test';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../types';
import {
  LeaderBoard,
  PaginatedTests,
  Tests,
  UserStats,
} from '../utils/objectTypes';

@Resolver()
export class TestResolver {
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
      accuracyData.push(parseInt(test.accuracy.replace('%', '')));
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
        accuracy = accuracy + parseInt(test.accuracy.replace('%', ''));
        wpmList.push(test.wpm);
      });
      if (recentTests.length >= 10) {
        recentTests.forEach((test) => {
          recentWpm = recentWpm + test.wpm;
          recentAccuracy =
            recentAccuracy + parseInt(test.accuracy.replace('%', ''));
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
            .addSelect('MAX(t.accuracy)', 'max_accuracy')
            .from(Test, 't')
            .where('t.time = :time', { time: '60' })
            .groupBy('t.creatorId'),
        'max_tests',
        'max_tests.max_wpm = test.wpm AND max_tests."creatorId" = test."creatorId" AND max_tests.max_accuracy = test.accuracy'
      )
      .leftJoinAndSelect('test.creator', 'creator')
      .where('test.time = :time', { time: '60' })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MIN(t2.createdAt)')
          .from(Test, 't2')
          .where('t2.creatorId = test.creatorId')
          .andWhere('t2.wpm = test.wpm')
          .andWhere('t2.accuracy = test.accuracy')
          .getQuery();
        return `test."createdAt" = (${subQuery})`;
      })
      .orderBy('test.wpm', 'DESC')
      .addOrderBy('test.accuracy', 'DESC');

    const tests = await qb.getMany();
    const length = tests.length;
    let userRank = -1;
    let userName: string = '';
    let userWpm: number = 0;
    let userAccuracy: string = '';
    let testTaken: string = '';

    let leaderBoard = [];

    let prevWpm = Infinity;
    let prevAccuracy = 0;
    let rank = 0;

    // get rank based on wpm
    // if two users have same wpm and same accuracy then increment rank
    // if two users have same wpm then arrange in order of increasing accuracy
    // Issue: if two users have tests with the same wpm and the same accuracy one of them doesn't appear
    for (let i = 0; i < length; i++) {
      const { wpm, accuracy } = tests[i];

      if (
        wpm < prevWpm ||
        (wpm === prevWpm && parseInt(accuracy.replace('%', '')) > prevAccuracy)
      ) {
        rank = i + 1;
        prevWpm = wpm;
        prevAccuracy = parseInt(accuracy.replace('%', ''));
      } else {
        // If the current test has the same WPM and Accuracy as the previous test,
        rank += 1;
      }

      leaderBoard.push({
        rank,
        user: tests[i].creator.username,
        wpm: wpm,
        accuracy: accuracy,
        time: '60',
        testTaken: tests[i].testTaken,
      });
    }
    leaderBoard = leaderBoard.slice(0, 50);

    // Get user rank based on uid
    for (let i = 0; i < length; i++) {
      if (tests[i].creatorId === uid) {
        userRank = i + 1;
        userName = tests[i].creator.username;
        userWpm = tests[i].wpm;
        userAccuracy = tests[i].accuracy;
        testTaken = tests[i].testTaken;
        break;
      }
    }

    return {
      leaderBoard,
      user: {
        rank: userRank,
        user: userName,
        wpm: userWpm,
        accuracy: userAccuracy,
        time: '60',
        testTaken: testTaken,
      },
    };
  }
}
