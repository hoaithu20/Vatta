import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { GetQuestionType, Level, QuestionStatus } from "src/common/constants";
import { PagingRequest } from "./paging.request";

export class DoQuestionRequest {
  @ApiProperty()
  @IsArray()
  question: number[];
}

export class GetQuestionRequest extends PagingRequest {
  @ApiProperty({example: `${Level.EASY} | ${Level.MEDIUM} | ${Level.HARD}`})
  @IsEnum(Level)
  @IsOptional()
  level: Level;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({example: `${GetQuestionType.ACTIVE} | ${GetQuestionType.INACTIVE} | ${GetQuestionType.DONE} | ${GetQuestionType.MINE} | ${GetQuestionType.NOT_DONE}`})
  @IsEnum(GetQuestionType)
  type: number;
}

export class DictionaryRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;
}

export class ApproveQuestionRequest {
  @ApiProperty()
  @IsArray()
  questions: number[];

  @ApiProperty()
  @IsEnum(QuestionStatus)
  status: number;
}

