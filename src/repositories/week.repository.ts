import { EntityRepository } from "@mikro-orm/mysql";
import { Week } from "../entities/week.entity";

export class WeekRepository extends EntityRepository<Week> {}
