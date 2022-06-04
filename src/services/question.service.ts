import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ErrorCode, GetQuestionType, QuestionStatus, UserRole, WeekStatus } from "src/common/constants";
import { CreateQuestionRequest, PagingRequest, DoQuestionRequest, GetQuestionRequest } from "src/dto";
import { Answer, Dictionary, History, Packages, Point, Question, User, Week } from "src/entities";
import _ from 'lodash';
import { MikroORM } from "@mikro-orm/core";

@Injectable()
export class QuestionService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Question)
    private readonly questionRepository: EntityRepository<Question>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Answer)
    private readonly answerRepository: EntityRepository<Answer>,
    @InjectRepository(History)
    private readonly historyRepository: EntityRepository<History>,
    @InjectRepository(Point)
    private readonly pointRepository: EntityRepository<Point>,
    @InjectRepository(Packages)
    private readonly packageRepository: EntityRepository<Packages>
  ) { }
  async getListQuestion(request: PagingRequest) {
    const pageSize = request.pageSize || 10;
    const pageIndex = request.pageIndex || 1;

    const query = this.questionRepository
      .createQueryBuilder('q')
      .where({ status: QuestionStatus.ACTIVE })
      .offset((pageIndex - 1) * pageSize)
      .limit(pageSize)
    const [count, questions] = await Promise.all([ 
      query.getCount(),
      query.joinAndSelect('q.answers', 'a').getResultList(),
    ])
    console.log(questions[0].answers)
    const questionMap = questions.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      totalAnswer: item.totalAnswer,
      correctAnswer: item.correctAnswer,
      user: item.user.username,
      answers: _.shuffle(item.answers.getItems().map((a) => ({
        id: a.id,
        content: a.content,
        description: a.description,
        isTrue: a.isTrue
      }))),
    }));

    return [_.shuffle(questionMap), count];
  }

  async createQuestion(userId: number, request: CreateQuestionRequest) {
    const { title, level, answers } = request;
    const user = await this.userRepository.findOne({ id: userId });

    const status =
      user.role === UserRole.ADMIN ? QuestionStatus.ACTIVE : QuestionStatus.INACTIVE;

      const em = this.orm.em.fork();
      await em.begin();
      
      try {
          const newQuestion = this.questionRepository.create({
            title,
            level,
            status,
            totalAnswer: request.answers.length,
            user: userId as any,
          });
          const answerArr: Answer[] = [];
          for (const answer of answers) {
            const newAnswer = this.answerRepository.create({
              content: answer.content,
              isTrue: answer.isCorrect,
              question: newQuestion,
              description: answer.explain,
            });
            answerArr.push(newAnswer)
    
          }
          await em.persistAndFlush([newQuestion,...answerArr])
          const correctAnswer = answerArr.find((a) => a.isTrue === true)
          newQuestion.correctAnswer = correctAnswer.id;
        await em.commit(); 
      } catch (e) {
        await em.rollback();
        throw new BadRequestException({
          code: ErrorCode.UNSUCCESS
        })
      }
  }

  async doQuestion(user: User, request: DoQuestionRequest) {
    const history = await this.historyRepository
      .findOne({ user: user.id, package: null })
    if (!history) {
      const newHistory = this.historyRepository.create({
        user: user.id,
        questions: request.question,
      });
      await this.historyRepository.persistAndFlush(newHistory);
    } else {
      const questionIds = _.union(history.questions.concat(request.question));
      history.questions = questionIds;
      await this.historyRepository.flush()
    };
  }


  async getQuestion(userId: number, request: GetQuestionRequest) {
    const pageSize = request.pageSize || 10;
    const pageIndex = request.pageIndex || 1;
    console.log(request)
    let questionIds = [];
    const history = await this.historyRepository
      .findOne({ user: userId, package: null })
    console.log(history);
    if (history) {
      questionIds = history.questions;
    }
    const query = this.questionRepository
      .createQueryBuilder('q')
      .offset((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .orderBy({'q.createdAt': 'DESC'});
    if (request.type == GetQuestionType.ACTIVE) {
      query.where({'q.status' : QuestionStatus.ACTIVE });
    } else if (request.type == GetQuestionType.INACTIVE) {
      query.where({'q.status': QuestionStatus.INACTIVE });
    } else if (request.type == GetQuestionType.DONE) {
      query.where({ 'q.id': {$in : questionIds }});
    } else if (request.type == GetQuestionType.NOT_DONE) {
      query.where({'q.id': {$nin : questionIds }});
    } else {
      query.where({'q.user_id' : userId });
    }

    if (request.level) {
      console.log('level', request.level);
      query.andWhere({'q.level' : request.level });
    }
    if (request.search) {
      query.andWhere({'q.title' : {$like : '%' + request.search + '%'}});
    }

    const [count, data] = await Promise.all([
      query.getCount(),
      query
      .leftJoinAndSelect('q.answers', 'a')
      .getResultList(),
    ]);
    const dataMap = data.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      totalAnswer: item.totalAnswer,
      correctAnswer: item.correctAnswer,
      user: item.user.username,
      answers: item.answers.getItems().map((a) => ({
        id: a.id,
        content: a.content,
        description: a.description,
        isTrue: a.isTrue
      })),
    }));
    return [dataMap, count];
  }

  async getStatics(userId: number) {
    const week = await this.orm.em.findOneOrFail(Week, {
      status: WeekStatus.ACTIVE
    })
    const point = await this.pointRepository
      .createQueryBuilder()
      .select('point')
      .where({$and : [{'user_id' :userId }, {'week' : week.week}]})
      .execute('get');
    const query = this.historyRepository
      .createQueryBuilder()
      .where({'user_id' : userId });

    const [question, _package] = await Promise.all([
      query
        .clone()
        .select('questions')
        .andWhere('package_id IS NULL')
        .execute('get'), /// ???
      query
        .select('DISTINCT(package_id)')
        .andWhere('package_id IS NOT NULL')
        .execute('all', true),
    ]);

    const allQuestion = this.questionRepository
      .createQueryBuilder()
      .where({'status' : QuestionStatus.ACTIVE })
    const [allQuestionNum, questionMineNum] = await Promise.all([
      allQuestion.clone().getCount(),
      allQuestion.andWhere({'user_id' : userId}).getCount()
    ])
    const allPackage = this.packageRepository
      .createQueryBuilder()
    const [allPackageNum, packageMineNum] = await Promise.all([
      allPackage.clone().getCount(),
      allPackage.where({'user_id' : userId}).getCount()
    ])
    return {
      totalPoint: point.point,
      questionDo: question ? question.questions.length : 0,
      packagesDo: _package.length,
      questionMine: questionMineNum,
      packageMine: packageMineNum,
      totalQuestion: allQuestionNum,
      totalPackage: allPackageNum,
    };
  }
}