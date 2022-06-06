import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Authentication } from 'src/common/decoraters/auth.decorator';
import { CurrUser } from 'src/common/decoraters/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetDetailStory, PagingRequest } from 'src/dto';
import { UpdateProfileRequest } from 'src/dto/user.request';
import { User } from 'src/entities';
import { PaginateResult } from 'src/responses/paginateResult';
import { UserService } from 'src/services/user.service';

@Controller('/api/user')
@ApiTags('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Authentication()
  // @Post('profile')
  // async getProfile(@CurrUser() user: User) {
  //   return await this.userService.getProfile(user.id);
  // }
  @Post('profile/:userId?')
  async getProfile(@CurrUser() user, @Query('user_id') userId?: number) {
    console.log(userId);
    let id = 0;
    if (userId) {
      id = userId;
    } else id = user.id;
    return await this.userService.getProfile(id);
  }

  @Authentication()
  @ApiBearerAuth()
  @Post('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(
    @CurrUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() input: UpdateProfileRequest,
  ) {
    return await this.userService.updateProfile(user.id, input, file?.filename);
  }

  // @Get('avatar/:img?')
  @Get('avatar/:img?')
  async getAvatar(@Query('img') img: string, @Res() res) {
    return res.sendFile(img, {
      root: 'upload',
    });
  }

  @ApiBody({
    type: PagingRequest,
  })
  @Post('list-story')
  async getListStory(@Body() request: PagingRequest) {
    const [data, count] = await this.userService.getListStory(request);
    return PaginateResult.init(data, count);
  }

  @ApiBody({
    type: GetDetailStory,
  })
  @Post('get-detail-story')
  async getDetailStory(@Body() request: GetDetailStory) {
    return await this.userService.getDetailStory(request);
  }
}
