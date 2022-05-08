import { EntityRepository } from "@mikro-orm/mysql";
import { Question } from "../entities/question.entity";

export class QuestionRepository extends EntityRepository<Question> {}
