import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { ErrorCode } from "src/constants";

export class ForgotPasswordRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class CheckOtpRequest {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
  otp: number;
}

export class ResetPasswordRequest {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  confirmPassword: string;

}

export class ChangePasswordRequest {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/(?!.*\s).{5,30}$/, {
    message: ErrorCode.INVALID_PASSWORD_FORMAT,
  })
  confirmPassword: string;
}