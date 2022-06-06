import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DictionaryRequest } from 'src/dto';
import { DictionaryService } from 'src/services/dictionnary.service';

@ApiTags('api/question')
@Controller('api/question')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('craw')
  async crawData() {
    return await this.dictionaryService.insertData();
  }

  @ApiBody({
    type: DictionaryRequest,
  })
  @Post('find')
  async dictionary(@Body() request: DictionaryRequest) {
    return await this.dictionaryService.dictionary(request);
  }

  @ApiBody({
    type: DictionaryRequest,
  })
  @Post('suggest')
  async suggest(@Body() request: DictionaryRequest) {
    return await this.dictionaryService.suggestString(request);
  }
}
