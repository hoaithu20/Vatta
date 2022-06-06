import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UpdateProfileRequest } from 'src/dto/user.request';
import { Profile, Story, User } from 'src/entities';
import fs from 'fs';
import { GetDetailStory, PagingRequest } from 'src/dto';
import { QuestionStatus } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    @InjectRepository(Story)
    private readonly storyRepo: EntityRepository<Story>
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

  async getListStory(request: PagingRequest) {
    const size = request.pageSize || 5;
    const index = request.pageIndex || 1;
    const query = this.storyRepo
      .createQueryBuilder()
      .where({'status' : QuestionStatus.ACTIVE })
      .offset((index - 1) * size)
      .limit(size);
    const [stories, count] = await Promise.all([
      query.getResultList(),
      query.getCount(),
    ]);

    return [
      stories.map((i) => ({
        id: i.id,
        content: i.content,
        audio: i.audio,
        background: i.img,
        title: i.title,
      })),
      count,
    ];
  }

  async getDetailStory(request: GetDetailStory) {
    const story = await this.storyRepo.findOneOrFail({ id: request.storyId });
    return {
      content: story.content,
      audio: story.audio,
      background: story.img,
      title: story.title,
    };
  }
}
