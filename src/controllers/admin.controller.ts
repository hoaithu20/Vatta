import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants';
import { Authentication, Roles } from 'src/common/decoraters';
import { ApproveQuestionRequest, CreateStoryRequest } from 'src/dto';
import { AdminService } from 'src/services/admin.service';

@ApiTags('api/admin')
@Controller('api/admin')
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@Authentication()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBody({
    type: ApproveQuestionRequest,
  })
  @Post('approve')
  async approveQuestion(@Body() request: ApproveQuestionRequest) {
    return await this.adminService.approveQuestion(request);
  }

  @ApiBody({
    type: CreateStoryRequest,
  })
  @Post('create-story')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'audio' }, { name: 'image' }]),
  )
  async createStory(
    @UploadedFiles()
    files: { audio?: Express.Multer.File; image?: Express.Multer.File },
    @Body() request: CreateStoryRequest,
  ) {
    console.log(files);
    return await this.adminService.createStory(
      request,
      files.audio[0].filename,
      files.image[0].filename,
    );
  }

  @ApiBody({
    type: CreateStoryRequest,
  })
  @Post('update-story')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'audio' }, { name: 'image' }]),
  )
  async updateStory(
    @UploadedFiles()
    files: { audio?: Express.Multer.File; image?: Express.Multer.File },
    @Body() request: CreateStoryRequest,
  ) {
    await this.adminService.updateStory(
      request,
      files.audio[0].filename,
      files.image[0].filename,
    );
  }

  @Get('end-week')
  async endWeek() {
    return this.adminService.endWeek();
  }

  @Get('get-static')
  async getStatic() {
    return this.adminService.getStatic()
  }
}

