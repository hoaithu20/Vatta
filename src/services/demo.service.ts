import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Post } from '../entities';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: EntityRepository<Post>,
  ) {}

  getPosts() {
    return this.postRepo.findAll();
  }
}
