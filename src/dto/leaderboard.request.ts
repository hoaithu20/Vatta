import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PagingRequest } from './paging.request';

export class GetLeaderBoardRequest {
  @ApiProperty()
  @IsNumber()
  week: number;
}
