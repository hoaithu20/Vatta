import { EntityRepository } from "@mikro-orm/mysql";
import { Answer } from "../entities/answer.entity";

export class AnswerRepository extends EntityRepository<Answer> {}
