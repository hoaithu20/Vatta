import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}