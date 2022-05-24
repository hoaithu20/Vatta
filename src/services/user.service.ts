import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) { }

  async getProfile(userId: number) {
    const profile = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin('u.profile', 'p')
      .select([
        'u.id as id',
        'u.role as role',
        'u.email as email',
        'u.username as username',
        'p.avatar as avatar',
        'p.date_of_birth as dateOfBirth',
        'p.sex as sex',
      ])
      .where({'u.id' : userId})
      .execute()
    if (!profile) return;
    return profile;
  }

  async updateProfile(userId: number,)
}