import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ErrorCode, QuestionStatus, WeekStatus } from "src/common/constants";
import { CreatePackageRequest, DoPackageRequest, GetDetailHistoryRequest, GetDetailPackageRequest, PagingRequest } from "src/dto";
import { Packages, Question, Week, History, User, QuestionHistory, Point } from "src/entities";
import _ from 'lodash';
import { MikroORM } from "@mikro-orm/core";

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
        't.id as id', 
        't.name as name', 
        't.level as `level`', 
        't.total_question as total', 
        't.time_out as time',
        't.username as username'
      ])
      .leftJoin('t.user', 'u')
      .where({'t.status': QuestionStatus.ACTIVE })
      .orderBy({'p.id': "DESC"})
      .offset((page - 1) * pageSize)
      .limit(pageSize)

    return await Promise.all([packages.execute(), packages. getCount()]);
  }

  async getDetailPackage(request: GetDetailPackageRequest) {
    const pageIndex = request.pageIndex || 1;
    const pageSize = request.pageSize || 10;

    const packages = await this.packageRepository
      .createQueryBuilder('p')
      .leftJoin('p.user', 'u')
      .select([
        'p.id as id',
        'p.like as `like`',
        'p.timeOut as time',
        'p.status as `status`',
        'p.level as `level`',
        'p.total_question as totalQuestion',
        'p.name as name',
        'u.username as username',
        'p.questionIds as questionIds'
      ])
      .where({'p.id': request.packageId })
      .getSingleResult();
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }
    const questions = await this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.answer', 'a')
      // .where({q.id IN (:,arr)' {
      //   arr: packages.questionIds,
      // })
      .getResultList()
    const questionMap = questions.map((item) => ({
      ...item,
      answers: _.shuffle(
        item.answers.getItems().map((i) => ({
          id: i.id,
          content: i.content,
          description: i.description,
          isTrue: i.isTrue,
        })),
      ),
    }));
    const packageMap = {
      ...packages,
      questions: _.shuffle(questionMap).slice(
        (pageIndex - 1) * pageSize,
        pageIndex * pageSize,
      ),
    };
    return [packageMap, packages.totalQuestion];
  }

  async createPackage(userId: number, request: CreatePackageRequest) {
    const questions = await this.questionRepository.find({ id: { $in: request.question } })
      const newPackage = await this.packageRepository.create({
        user: userId as any,
        totalQuestion: request.question.length,
        timeOut: request.time,
        level: request.level,
        isHidden: request.isHidden,
        name: request.name,
        questions: questions
      });
      await this.orm.em.persistAndFlush(newPackage)
  }

  async todoPackage(user: User, request: DoPackageRequest) {
    let countTrue = 0;
    const resultArr = [];
    const currentWeek = await this.weekRepository.findOne({status: WeekStatus.ACTIVE})
    const packages = await this.packageRepository.findOne({id: request.packageId})
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }

    const questionIds = request.questions.map(({questionId}) => questionId);
      // _.map(request.questions, 'questionId').length == 0
      //   ? null
      //   : _.map(request.questions, 'questionId');
    const questions = await this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.answers', 'a')
      .where({'q.id' : {$in: questionIds}})
      .getResultList();

    for (const item of request.questions) {
      const question = questions.find((question) => question.id == item.questionId);
      const answerIds = question.answers.getItems().map((answer) => answer.id)
      if (!answerIds.includes(item.answerId)) {
        throw new BadRequestException({
          code: ErrorCode.ANSWER_NOT_IN_QUESTION,
        });
      }
      if (question && question.correctAnswer == item.answerId) {
        countTrue++;
      }
      resultArr.push({
        ...question,
        check: question && question.correctAnswer === item.answerId,
        answerId: item.answerId,
      });
    }
    
    //await this.connection.transaction(async (manager) => {
      // await this.connection.manager
      //   .createQueryBuilder()
      //   .update(History)
      //   .set({ isCurrent: false })
      //   .where('package_id = :packageId AND is_current = true', {
      //     packageId: request.packageId,
      //   })
      //   .execute();
      // const questionMap: QuestionMap[] = [];
      // for (const i of request.questions) {
      //   const question: QuestionMap = {
      //     [i.questionId]: i.answerId,
      //   };
      //   questionMap.push(question);
      // }
      // console.log('yoona', questionMap);
      // console.log(request.packageId);

      const newHistory = new History();
      newHistory.user = user;
      newHistory.point = countTrue;
      newHistory.package = packages;
      newHistory.questionMap = request.questions;

      let points = await this.pointRepository.findOne({user: user.id});
      
      if (!points) {
      points = new Point(user, countTrue, currentWeek.id);
      } else {
        points.point = points.point + countTrue;
      }

     await this.orm.em.persistAndFlush([newHistory, points])

    return resultArr;
  }

  async getHistory(userId: number, request: PagingRequest) {
    const page = request.pageIndex || 1;
    const pageSize = request.pageSize || 10;

    const query = this.historyRepository
      .createQueryBuilder('h')
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
      .where({'h.user_id' : {userId}})
      .orderBy({'h.created_at': 'DESC'})
      .offset((page - 1) * pageSize)
      .limit(pageSize)

    const [data, count] = await Promise.all([
      query
        // .clone()
        // .offset((page - 1) * pageSize)
        // .limit(pageSize)
        .getSingleResult(),
       query.getCount(),
    ]);

    return [data, count];
  }

  async getDetailPackageHistory(userId: number, packageId: number) {
    const histories = await this.historyRepository
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.package', 'p')
      // .where('h.user_id = :userId AND h.package_id = :packageId', {
      //   userId,
      //   packageId,
      // })
      .where({$and: [{'h.user_id' : userId}, {'h.package_id' : packageId}]})
      .orderBy({'h.created_at': 'DESC'})
      .getResultList();
    const points = histories.map((history) => history.point);
    const maxPoint = Math.max(...points);
    const sumPoint = parseInt(
      _.reduce(points, function (sum, num) {
        return sum + num;
      }, 0),
    );
    return {
      maxPoint,
      averagePoint: (sumPoint / histories.length).toFixed(2),
      totalQuestion: histories[0].package.totalQuestion,
      namePackage: histories[0].package.name,
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
    
    const history = await this.historyRepository.findOne({user: userId, id: request.historyId})
    if (!history) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_HISTORY,
      });
    }
    const packages = await this.packageRepository.findOne({id: history.package.id})
    if (!packages) {
      throw new BadRequestException({
        code: ErrorCode.NOT_FOUND_PACKAGE,
      });
    }
    const questionIds = packages.questions.getItems().map((q) => q.id)
    const questions = await this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.answers', 'a')
      .where({'q.id': {$in : questionIds} })
      .getResultList();
    console.log(questions)
    const questionArr = [];
    console.log(history.questionMap);
    for (const item of history.questionMap) {
      const key = Object.keys(item);
      console.log(typeof key[0]);
      const question = this.findQuestionById(questions, Number(key[0]));
      console.log('question', question)
      questionArr.push({
        question: {
          id: question.id,
          level: question.level,
          title: question.title,
          correctAnswer: question.correctAnswer,
          answer: question.answers.map((a) => ({
            id: a.id,
            content: a.content,
            description: a.description,
            isTrue: a.isTrue,
          })),
        },
        answerPick: item[key[0]],
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
    // const page = request.pageIndex || 1;
    // const pageSize = request.pageSize || 10;

    const query = await this.pointRepo
      .createQueryBuilder('p')
      .select([
        'p.point as point',
        'u.username as username',
        'u.id as userId',
        'pp.avatar as avatar',
      ])
      .leftJoin('p.user', 'u')
      .leftJoin('u.profile', 'pp')
      .where('p.week = :week AND p.point > 0', { week: request.week })
      .orderBy('p.point', 'DESC')
      .offset(0)
      .limit(10)
      .getRawMany();
    return query.map((item) => ({
      ...item,
      point: formatDecimal(item.point),
    }));
  }

  findQuestionById(questions, id) {
    return _.find(questions, {
      id: id,
    });
  }
}