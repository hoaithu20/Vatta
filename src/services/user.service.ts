import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UpdateProfileRequest } from 'src/dto/user.request';
import { Profile, User } from 'src/entities';
import fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
  ) {}

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
      .where({ 'u.id': userId })
      .execute('get');
    if (!profile) return;
    return profile;
  }

  async updateProfile(
    userId: number,
    input: UpdateProfileRequest,
    file?: string,
  ) {
    let profile = await this.profileRepository.findOne({ user: userId });
    const oldAvatar = profile.avatar;
    profile = profile ? profile : new Profile();
    profile.avatar = file;
    profile.dateOfBirth = input.date;
    profile.sex = input.sex;
    await this.orm.em.persistAndFlush(profile);
    if(oldAvatar) fs.unlinkSync(`./upload/${oldAvatar}`);
    return profile;
  }
}
