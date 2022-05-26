import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrUser } from "src/common/decoraters/user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UpdateProfileRequest } from "src/dto/user.request";
import { User } from "src/entities";
import { UserService } from "src/services/user.service";

@Controller('/api/user')
@ApiTags('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrUser() user: User) {
    return await this.userService.getProfile(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(
    @CurrUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() input: UpdateProfileRequest,
  ) {
    return await this.userService.updateProfile(user.id, input, file?.filename )
    try {
      const profile = await this.profileRepository
        .createQueryBuilder()
        .where('user_id = :userId', { userId: user.id })
        .getOne();
      if (profile) {
        (profile.dateOfBirth = request.date),
          (profile.sex = request.sex),
          (profile.avatar = file?.filename),
          profile.save();
      } else {
        const newProfile = this.profileRepository.create({
          user: user.id as any,
          dateOfBirth: request.date,
          sex: request.sex,
          avatar: file?.filename,
        });
        newProfile.save();
        return newProfile;
      }
      return profile;
    } catch (err) {
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

}