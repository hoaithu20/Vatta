import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateProfileRequest {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sex: string;
}