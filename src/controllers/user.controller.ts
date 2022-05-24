import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrUser } from "src/common/decoraters/user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
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
}