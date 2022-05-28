import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ErrorCode } from 'src/common/constants/errorcode.constant';
import { Language } from 'src/common/constants/language.enum';

export class SignupRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  confirmPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Language)
  language: Language;
}
