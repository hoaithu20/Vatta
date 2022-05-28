import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TopicService } from "src/services/topic.service";

@ApiTags('api/topic')
@Controller('api/topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
  ) {}
}