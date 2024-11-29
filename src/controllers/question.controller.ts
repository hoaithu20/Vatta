import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Authentication, CurrUser } from 'src/common/decoraters';
import {
  CreateQuestionRequest,
  DoQuestionRequest,
  GenQuestionByAI,
  GetQuestionRequest,
  PagingRequest,
} from 'src/dto';
import { User } from 'src/entities';
import { PaginateResult } from 'src/responses/paginateResult';
import { QuestionService } from 'src/services/question.service';

@ApiTags('/api/question')
@Controller('/api/question')
@Authentication()
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiBody({
    type: PagingRequest,
  })
  @Post('list-random-question')
  async getListQuestion(@Body() request: PagingRequest) {
    const [result, count] = await this.questionService.getListQuestion(request);
    return PaginateResult.init(result, count);
  }

  @ApiBody({
    type: CreateQuestionRequest,
  })
  @Post('create-question')
  async createQuestion(
    @CurrUser() user: User,
    @Body() request: CreateQuestionRequest,
  ) {
    return this.questionService.createQuestion(user, request);
  }

  @ApiBody({
    type: GenQuestionByAI,
  })
  @Post('gen-question-by-ai')
  async genQuestion(@CurrUser() user: User, @Body() request: GenQuestionByAI) {
    return this.questionService.genQuestionByAI(user, request);
  }

  @ApiBody({
    type: GetQuestionRequest,
  })
  @Post('list-question')
  async listQuestion(
    @CurrUser() user: User,
    @Body() request: GetQuestionRequest,
  ) {
    const [data, count] = await this.questionService.getQuestion(
      user.id,
      request,
    );
    return PaginateResult.init(data, count);
  }

  @ApiBody({
    type: DoQuestionRequest,
  })
  @Post('do-question')
  async doQuestion(@CurrUser() user, @Body() request: DoQuestionRequest) {
    return await this.questionService.doQuestion(user, request);
  }

  @Get('get-statics')
  async getStatics(@CurrUser() user) {
    return await this.questionService.getStatics(user.id);
  }
}
