import { EntityRepository } from "@mikro-orm/mysql";
import { Topic } from "../entities/topic.entity";

export class TopicRepository extends EntityRepository<Topic> {}
