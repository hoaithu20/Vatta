import { EntityRepository } from "@mikro-orm/mysql";
import { Profile } from "../entities/user-profile.entity";

export class UserProfileRepository extends EntityRepository<Profile> {}
