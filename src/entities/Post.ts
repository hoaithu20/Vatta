import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'posts' })
export class Post {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;
}
