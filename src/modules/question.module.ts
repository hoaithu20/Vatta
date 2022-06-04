import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { QuestionsController } from 'src/controllers/question.controller';
import { Answer, Packages, Point, Question, User, History } from 'src/entities';
import { QuestionService } from 'src/services/question.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Question,
      User,
      Answer,
      History,
      Point,
      Packages,
    ]),
  ],
  providers: [QuestionService],
  controllers: [QuestionsController],
  exports: [QuestionService],
})
export class QuestionModule {}
