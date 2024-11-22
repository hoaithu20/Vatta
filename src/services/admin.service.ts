import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode, QuestionStatus, UserRole, WeekStatus } from 'src/common/constants';
import { ApproveQuestionRequest, CreateStoryRequest } from 'src/dto';
import { Packages, Question, Story, User, Week } from 'src/entities';
import fs from 'fs';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class AdminService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(Question)
    private readonly questionRepository: EntityRepository<Question>,
    @InjectRepository(Week)
    private readonly weekRepository: EntityRepository<Week>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Packages)
    private readonly packageRepo: EntityRepository<Packages>
  ) { }

  async approveQuestion(request: ApproveQuestionRequest) {
    await this.questionRepository
      .createQueryBuilder()
      .update({ status: request.status })
      .where({ id: { $in: request.questions } });
  }

  async createStory(
    request: CreateStoryRequest,
    audio?: string,
    image?: string,
  ) {
    try {
      const newStory = this.storyRepository.create({
        audio,
        img: image,
        content: request.content,
        title: request.title,
      });
      await this.storyRepository.persistAndFlush(newStory);
    } catch (err) {
      fs.unlinkSync(`./upload/${audio}`);
      fs.unlinkSync(`./upload/${image}`);
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

  async updateStory(
    request: CreateStoryRequest,
    audio?: string,
    image?: string,
  ) {
    try {
      const story = await this.storyRepository.findOneOrFail({
        id: Number(request.storyId),
      });
      if (!story) return { mess: 'Không tìm thấy câu truyện cần cập nhật' };
      const [oldAudio, oldImg] = [story.audio, story.img];
      if (audio) story.audio = audio;
      if (image) story.img = image;
      if (request.content) story.content = request.content;
      if (request.title) story.title = request.title;
      await this.storyRepository.flush();
      if (oldAudio) fs.unlinkSync(`./upload/${oldAudio}`);
      if (oldImg) fs.unlinkSync(`./upload/${oldImg}`);
    } catch (err) {
      fs.unlinkSync(`./upload/${audio}`);
      fs.unlinkSync(`./upload/${image}`);
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

  async endWeek() {
    const week = await this.weekRepository.findOne({ status: WeekStatus.ACTIVE });
    const now = new Date();
    if (week) {
      week.status = WeekStatus.INACTIVE
      await this.weekRepository.flush()
    } else {
      const newWeek = this.weekRepository.create({
        status: WeekStatus.ACTIVE,
        startTime: now,
        endTime: new Date(now.getTime() + 1000 * 86400),
        week: (+(week?.week || '0') + 1) + '',
      })
      await this.weekRepository.persistAndFlush(newWeek)
    }
  }

  async getStatic() {
    const now = new Date;
    const first = now.getDate() - now.getDay();
    const last = first + 6;
    const firstDay = new Date(now.setDate(first));
    const lastDay = new Date(now.setDate(last));
    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(0, 0, 0, 0);
    const query = this.userRepo.createQueryBuilder().where({role: UserRole.USER});
    const [all, thisWeek] = await Promise.all([
      query.clone().getCount(),
      query.where({
        createdAt: {
          $gte: firstDay,
          $lte: lastDay,
        },
      })
        .getCount(),
    ])
    const question = await this.questionRepository.createQueryBuilder()
      .where({ status: QuestionStatus.ACTIVE })
      .getCount()
    const packages = await this.packageRepo.createQueryBuilder()
      .where({ status: QuestionStatus.ACTIVE })
      .getCount();
    return {
      userAll: all,
      userThisWeek: thisWeek,
      question,
      packages,
    }
  }
}
