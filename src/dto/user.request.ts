import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Sex } from "src/common/constants";

export class UpdateProfileRequest {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({example: `${Sex.FEMALE} | ${Sex.MALE} | ${Sex.UNKNOWN}`})
  @IsOptional()
  @IsEnum(Sex)
  sex: Sex;
}