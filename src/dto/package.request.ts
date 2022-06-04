import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Level, QuestionStatus } from 'src/common/constants';
import { PagingRequest } from './paging.request';

export class GetDetailPackageRequest extends PagingRequest {
  @ApiProperty()
  @IsNumber()
  packageId: number;
}

export class CreatePackageRequest {
  @ApiProperty()
  @IsNumber()
  time: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(Level)
  level: Level;

  @ApiProperty()
  @IsOptional()
  @IsEnum(QuestionStatus)
  status: QuestionStatus;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isHidden: boolean;

  @ApiProperty()
  @IsArray()
  question: number[];
}

export class Questions {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsBoolean()
  answerId: number;
}

export class DoPackageRequest {
  @ApiProperty()
  @IsNumber()
  packageId: number;

  @ApiProperty()
  @IsNumber()
  time: number;

  @ApiProperty()
  @IsArray()
  questions: Questions[];
}
