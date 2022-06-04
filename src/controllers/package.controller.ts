import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Authentication, CurrUser } from 'src/common/decoraters';
import {
  CreatePackageRequest,
  DoPackageRequest,
  GetDetailHistoryRequest,
  GetDetailPackageRequest,
  GetLeaderBoardRequest,
  PagingRequest,
} from 'src/dto';
import { User } from 'src/entities';
import { PaginateResult } from 'src/responses/paginateResult';
import { PackageService } from 'src/services/package.service';

@ApiTags('api/package')
@Controller('api/package')
@ApiBearerAuth()
@Authentication()
export class PackagesController {
  constructor(private readonly packageService: PackageService) {}

  @ApiBody({
    type: PagingRequest,
  })
  @Post('all-package')
  async getAllPackage(@Body() request: PagingRequest) {
    const [data, count] = await this.packageService.getAllPackage(request);
    return PaginateResult.init(data, count);
  }

  @ApiBody({
    type: GetDetailPackageRequest,
  })
  @Post('get-detail-package')
  async getDetailPackage(@Body() request: GetDetailPackageRequest) {
    const [data, count] = await this.packageService.getDetailPackage(request);
    return PaginateResult.init(data, count);
  }

  @ApiBody({
    type: CreatePackageRequest,
  })
  @Post('create-package')
  async createPackage(
    @CurrUser() user: User,
    @Body() request: CreatePackageRequest,
  ) {
    return this.packageService.createPackage(user.id, request);
  }

  @ApiBody({
    type: DoPackageRequest,
  })
  @Post('do-package')
  async doPackage(@CurrUser() user: User, @Body() request: DoPackageRequest) {
    return await this.packageService.todoPackage(user, request);
  }

  @Post('get-history')
  async getHistory(@CurrUser() user: User, @Body() request: PagingRequest) {
    const [data, count] = await this.packageService.getHistory(
      user.id,
      request,
    );
    return PaginateResult.init(data, count);
  }

  @Post('get-detail-package-history')
  async getDetail(
    @CurrUser() user: User,
    @Body() request: GetDetailPackageRequest,
  ) {
    return await this.packageService.getDetailPackageHistory(
      user.id,
      request.packageId,
    );
  }

  @ApiBody({
    type: GetDetailHistoryRequest,
  })
  @Post('get-detail-history')
  async getDetailHistory(
    @CurrUser() user: User,
    @Body() request: GetDetailHistoryRequest,
  ) {
    return await this.packageService.getDetailHistory(user.id, request);
  }

  @Post('leaderboard')
  async getLeaderBoard(@Body() request: GetLeaderBoardRequest) {
    return await this.packageService.getLeaderBoard(request);
  }
}
