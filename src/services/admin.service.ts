import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ErrorCode } from "src/common/constants";
import { ApproveQuestionRequest, CreateStoryRequest } from "src/dto";
import { Question, Story } from "src/entities";
import fs from 'fs';
import { MikroORM } from "@mikro-orm/core";

@Injectable()
export class AdminService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(Question)
    private readonly questionRepository: EntityRepository<Question>
  ) {}

  async approveQuestion(request: ApproveQuestionRequest) {
    await this.questionRepository
    .createQueryBuilder()
    .update({ status: request.status })
    .where({ id: {$in: request.questions}});
  }

  async createStory(request: CreateStoryRequest, audio?: string, image?: string) {
    try {
      const newStory = this.storyRepository.create({
        audio,
        img: image,
        content: request.content,
        title: request.title
      });
      await this.storyRepository.persistAndFlush(newStory)
    } catch (err) {
      fs.unlinkSync(`./upload/${audio}`)
      fs.unlinkSync(`./upload/${image}`)
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

  async updateStory(request: CreateStoryRequest, audio?: string, image?: string) {
    try {
      const story = await this.storyRepository.findOneOrFail({
        id: Number(request.storyId),
      });
      if(!story) return {mess: 'Không tìm thấy câu truyện cần cập nhật'}
      const [oldAudio, oldImg] = [story.audio, story.img];
      if (audio) story.audio = audio;
      if (image) story.img = image;
      if (request.content) story.content = request.content;
      if (request.title) story.title = request.title;
      await this.storyRepository.flush()
      fs.unlinkSync(`./upload/${oldAudio}`)
      fs.unlinkSync(`./upload/${oldImg}`)
    } catch (err) {
      fs.unlinkSync(`./upload/${audio}`);
      fs.unlinkSync(`./upload/${image}`)
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }
}