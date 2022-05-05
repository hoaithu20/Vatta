import { Controller, Get } from '@nestjs/common';
import { DemoService } from '../services/demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('posts')
  getPosts() {
    return this.demoService.getPosts();
  }
}
