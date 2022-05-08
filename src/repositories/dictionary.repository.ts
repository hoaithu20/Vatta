import { EntityRepository } from "@mikro-orm/mysql";
import { Dictionary } from "../entities/dictionary.entity";

export class PackageRepository extends EntityRepository<Dictionary> {}
