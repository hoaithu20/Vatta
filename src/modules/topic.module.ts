import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TopicController } from "src/controllers/topic.controller";
import { Topic } from "src/entities";
import { TopicService } from "src/services/topic.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([Topic])
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService]
})
export class TopicModule {}