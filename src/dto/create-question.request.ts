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
import { Level } from 'src/common/constants';

class Answer {
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
  @Type(() => Answer)
  answers: Answer[];
}

export class GetDetailStory {
  @ApiProperty()
  @IsNumber()
  storyId: number;
}
