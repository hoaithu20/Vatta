import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PagingRequest } from './paging.request';

export class GetDetailHistoryRequest extends PagingRequest {
  @ApiProperty()
  @IsNumber()
  historyId: number;
}
