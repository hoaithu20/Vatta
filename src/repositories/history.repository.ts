import { EntityRepository } from "@mikro-orm/mysql";
import { History } from "../entities/history.entity";

export class HistoryRepository extends EntityRepository<History> {}