import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole, UserStatus } from '../common/constants';
import { History } from './history.entity';
import { Point } from './point.entity';
import { Question } from './question.entity';
import { Packages } from './package.entity';
import { Profile } from './profile.entity';

@Entity({ tableName: 'user' })
export class User {
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  username: string;

  @Property({ nullable: false })
  email: string;

  @Property({ nullable: false })
  password: string;

  @Property({
    nullable: false,
    default: UserStatus.VERIFYING,
  })
  status: UserStatus;

  @Property({ default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Question, (q) => q.user)
  questions = new Collection<Question>(this);

  @OneToMany(() => Packages, (p) => p.user)
  packages = new Collection<Packages>(this);

  @OneToMany(() => History, (h) => h.user)
  histories = new Collection<History>(this);

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile;

  @OneToMany(() => Point, (p) => p.user)
  points = new Collection<Point>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
