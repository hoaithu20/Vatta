import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrUser } from 'src/common/decoraters/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ErrorCode } from 'src/constants';
import { LoginRequest, SignupRequest } from 'src/dto';
import { ForgotPasswordRequest } from 'src/dto/forgot-pass.request';
import { PagingRequest } from 'src/dto/paging.request';
import { User } from 'src/entities';
// import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthService } from 'src/services/auth.service';

@ApiTags('/api/auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({
    type: SignupRequest,
  })
  @Post('signup')
  async signup(@Body() request: SignupRequest) {
    return await this.authService.signup(request);
  }

  @ApiBody({
    type: LoginRequest,
  })
  @Post('login')
  async login(@Body() request: LoginRequest) {
    return await this.authService.login(request.username, request.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('a')
  a(@CurrUser() user: User) {
    return user;
    throw new BadRequestException({
      code: ErrorCode.ANSWER_NOT_IN_QUESTION
    })
  }

  @ApiBody({
    type: ForgotPasswordRequest
  })
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  // @Post('reset-password')
  // async resetPassword(@Body() request: ResetPasswordRequest) {
  //   return await this.authService.resetPassword(request);
  // }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Post('change-password')
  // async changePassword(
  //   @CurrUser() user: User,
  //   @Body() request: ChangePasswordRequest,
  // ) {
  //   return await this.authService.changePassword(user.id, request);
  // }
}
