import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Language, Level } from 'src/common/constants';

export class AnswerDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explain: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionRequest {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Level)
  level: Level;

  @ApiProperty()
  @IsArray()
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class GetDetailStory {
  @ApiProperty()
  @IsNumber()
  storyId: number;
}

export class GenQuestionByAI {
  @ApiProperty({example: 1})
  @IsNumber()
  numberOfQuestion: number;

  @ApiProperty({example: 1})
  @IsOptional()
  @IsEnum(Level)
  level: Level = Level.EASY;

  @ApiProperty({example: 'câu bị động'})
  @IsString()
  topic: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Language)
  language: Language = Language.ENGLISH;
}
