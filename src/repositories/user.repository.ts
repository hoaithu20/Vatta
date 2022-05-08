import { EntityRepository } from "@mikro-orm/mysql";
import { User } from "../entities/user.entity";

export class UserRepository extends EntityRepository<User> {}