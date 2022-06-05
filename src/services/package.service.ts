import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode, QuestionStatus, WeekStatus } from 'src/common/constants';
import {
  CreatePackageRequest,
  DoPackageRequest,
  GetDetailHistoryRequest,
  GetDetailPackageRequest,
  GetLeaderBoardRequest,
  PagingRequest,
} from 'src/dto';
import { Packages, Question, Week, History, User, Point } from 'src/entities';
import _, { forEach } from 'lodash';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class PackageService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Packages)
    private readonly packageRepository: EntityRepository<Packages>,
    @InjectRepository(Question)
    private readonly questionRepository: EntityRepository<Question>,
    @InjectRepository(Week)
    private readonly weekRepository: EntityRepository<Week>,
    @InjectRepository(History)
    private readonly historyRepository: EntityRepository<History>,
    @InjectRepository(Point)
    private readonly pointRepository: EntityRepository<Point>,
  ) {}

  async getAllPackage(request: PagingRequest) {
    const page = request.pageIndex || 1;
    const pageSize = request.pageSize || 10;
    const packages = this.packageRepository
      .createQueryBuilder('t')
      .select([
        't.id',
        't.name',
        't.level',
        't.total_question as total',
        't.time_out as time',
        'u.username',
      ])
      .leftJoin('t.user', 'u')
      .where({ 't.status': QuestionStatus.ACTIVE })
      .orderBy({ 't.id': 'DESC' })
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    return await Promise.all([packages.execute('all'), packages.getCount()]);
  }

  async getDetailPackage(request: GetDetailPackageRequest) {
    const pageIndex = request.pageIndex || 1;
    const pageSize = request.pageSize || 10;

    const packages = await this.packageRepository.findOne({
      id: request.packageId,
    });
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }
    const questions = await packages.questions.matching({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      orderBy: { id: 'DESC' },
      store: true,
    });
    const questionMap = [];
    for (const item of questions) {
      const answer = await item.answers.loadItems();
      questionMap.push({
        id: item.id,
        title: item.title,
        status: item.status,
        level: item.level,
        totalAnswer: item.totalAnswer,
        correctAnswer: item.correctAnswer,
        answers: _.shuffle(
          answer.map((i) => ({
            id: i.id,
            content: i.content,
            description: i.description,
            isTrue: i.isTrue,
          })),
        ),
      });
    }
    const packageMap = {
      id: packages.id,
      status: packages.status,
      totalQuestion: packages.totalQuestion,
      level: packages.level,
      timeOut: packages.timeOut,
      name: packages.name,
      username: packages.user?.username,
      questions: _.shuffle(questionMap),
    };
    return [packageMap, packages.totalQuestion];
  }

  async createPackage(userId: number, request: CreatePackageRequest) {
    const questions = await this.questionRepository.find({
      id: { $in: request.question },
    });
    const newPackage = await this.packageRepository.create({
      user: userId as any,
      totalQuestion: request.question.length,
      timeOut: request.time,
      level: request.level,
      isHidden: request.isHidden,
      name: request.name,
      questions: questions,
    });
    await this.orm.em.persistAndFlush(newPackage);
  }

  async todoPackage(user: User, request: DoPackageRequest) {
    let countTrue = 0;
    const resultArr = [];
    const currentWeek = await this.weekRepository.findOne({
      status: WeekStatus.ACTIVE,
    });
    const packages = await this.packageRepository.findOne({
      id: request.packageId,
    });
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }

    const questions = await packages.questions.matching({
      store: true,
    });

    for (const item of request.questions) {
      const question = questions.find(
        (question) => question.id == item.questionId,
      );
      const answers = await question.answers.loadItems();
      const answerId = answers.map((i) => i.id);
      if (!answerId.includes(item.answerId)) {
        throw new BadRequestException({
          code: ErrorCode.ANSWER_NOT_IN_QUESTION,
        });
      }
      if (question && question.correctAnswer == item.answerId) {
        countTrue++;
      }
      resultArr.push({
        id: question.id,
        title: question.title,
        status: question.status,
        level: question.level,
        totalAnswer: question.totalAnswer,
        correctAnswer: question.correctAnswer,
        answers: answers.map((a) => ({
          id: a.id,
          content: a.content,
          description: a.description,
          isTrue: a.isTrue,
        })),
        check: question && question.correctAnswer === item.answerId,
        answerId: item.answerId,
      });
    }

    const newHistory = new History();
    newHistory.user = user;
    newHistory.point = countTrue;
    newHistory.package = packages;
    newHistory.questionMap = request.questions;
    newHistory.time = request.time;

    let points = await this.pointRepository.findOne({ user: user.id });

    if (!points) {
      points = new Point(user, countTrue, currentWeek.id);
    } else {
      points.point = points.point + countTrue;
    }

    await this.orm.em.persistAndFlush([newHistory, points]);
    return resultArr;
  }

  async getHistory(userId: number, request: PagingRequest) {
    const page = request.pageIndex || 1;
    const pageSize = request.pageSize || 10;

    // const query = this.historyRepository
    //   .createQueryBuilder('h')
    //   .select([
    //     'h.package_id as packageId',
    //     'p.name as name',
    //     'h.point as point',
    //     'h.time as time',
    //     'u.id as userId',
    //     'u.username as username',
    //   ])
    //   .leftJoin('h.package', 'p')
    //   .leftJoin('p.user', 'u')
    //   .where({ 'h.user_id': { userId } })
    //   .orderBy({ 'h.created_at': 'DESC' })
    //   .offset((page - 1) * pageSize)
    //   .limit(pageSize)
    const query = this.historyRepository
      .createQueryBuilder('h')
      .where({ user: userId })
      .select([
        'h.package_id as packageId',
        'p.name as name',
        'h.point as point',
        'h.time as time',
        'u.id as userId',
        'u.username as username',
      ])
      .leftJoin('h.package', 'p')
      .leftJoin('p.user', 'u')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy({ createdAt: 'DESC' });
    const [data, count] = await Promise.all([
      query.execute('all'),
      query.getCount(),
    ]);

    return [data, count];
  }

  async getDetailPackageHistory(userId: number, packageId: number) {
    const packages = await this.packageRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.histories', 'h')
      // .where('h.user_id = :userId AND h.package_id = :packageId', {
      //   userId,
      //   packageId,
      // })
      .where({ $and: [{ 'h.user_id': userId }, { 'h.package_id': packageId }] })
      .orderBy({ 'h.created_at': 'DESC' })
      .getSingleResult();

    console.log(packages);
    const histories = packages.histories.getItems();
    const points = histories.map((i) => i.point);
    const maxPoint = Math.max(...points);
    let sumPoint = 0;
    points.forEach((i) => {
      sumPoint = sumPoint + i;
    });
    return {
      maxPoint,
      averagePoint: (sumPoint / histories.length).toFixed(2),
      totalQuestion: packages.totalQuestion,
      namePackage: packages.name,
      items: histories.map((item) => ({
        historyId: item.id,
        time: item.time,
        point: item.point,
        createAt: item.createdAt,
        totalDo: Object.keys(item.questionMap).length,
      })),
    };
  }

  async getDetailHistory(userId: number, request: GetDetailHistoryRequest) {
    const history = await this.historyRepository.findOne({
      user: userId,
      id: request.historyId,
    });
    if (!history) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_HISTORY,
      });
    }
    console.log(history);
    const packages = await this.packageRepository.findOne({
      id: history.package.id,
    });
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }
    const questions = await packages.questions.matching({
      store: true,
    });
    console.log('yoona', history.questionMap);
    const questionArr = [];
    for (const item of history.questionMap) {
      const question = questions.find((q) => q.id === item.questionId);
      const answer = await question.answers.loadItems();
      questionArr.push({
        question: {
          id: question.id,
          level: question.level,
          title: question.title,
          correctAnswer: question.correctAnswer,
          answer: answer.map((a) => ({
            id: a.id,
            content: a.content,
            description: a.description,
            isTrue: a.isTrue,
          })),
        },
        answerPick: item.answerId,
      });
    }
    console.log(questionArr);
    return {
      point: history.point,
      time: history.time,
      timePackage: packages.timeOut,
      namePackage: packages.name,
      questions: questionArr,
    };
  }

  async getLeaderBoard(request: GetLeaderBoardRequest) {
    const week = await this.weekRepository.findOne({
      status: WeekStatus.ACTIVE,
    });
    if (!week)
      return {
        mess: 'Tuần mới chưa kích hoạt',
      };
    const point = await this.pointRepository
      .createQueryBuilder('p')
      .select([
        'p.point as point',
        'u.username as username',
        'u.id as userId',
        'pp.avatar as avatar',
      ])
      .leftJoin('p.user', 'u')
      .leftJoin('u.profile', 'pp')
      .where('p.week = ? AND p.point > 0', [request.week])
      .orderBy({ 'p.point': 'DESC' })
      .offset(0)
      .limit(10)
      .execute();
    return point;
  }
}
