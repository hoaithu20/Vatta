import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Answer, Dictionary, Point, Post, User, History, QuestionHistory, Question, Story, Profile, Topic, Week } from 'src/entities';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature([Post, User, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week])
  ],
  exports: [MikroOrmModule, OrmModule],
})
export class OrmModule { }