import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";
import { ErrorCode } from "src/common/constants";

export class PagingRequest {
  @ApiProperty()
  @IsNumber(
    {allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0},
    {message: ErrorCode.PAGE_INDEX_NOT_INTEGER}
  )
  @IsOptional()
  @Min(1, {message: ErrorCode.PAGE_INDEX_MIN_ONE})
  pageIndex: number;

  @ApiProperty()
  @IsNumber(
    {allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0},
    { message: ErrorCode.PAGE_INDEX_NOT_INTEGER}
  )
  @IsOptional()
  @Min(1, {message: ErrorCode.PAGE_SIZE_MIN_ONE})
  pageSize: number;
}