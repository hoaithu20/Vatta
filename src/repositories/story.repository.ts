import { EntityRepository } from "@mikro-orm/mysql";
import { Story } from "../entities/story.entity";

export class StoryRepository extends EntityRepository<Story> {}
