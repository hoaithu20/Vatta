import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRole, UserStatus } from "../constants";
import { History } from "./history.entity";
import { Point } from "./point.entity";
import { Question } from "./question.entity";
import { Topic } from "./topic.entity";
import { Profile } from "./user-profile.entity";

@Entity({tableName: 'user'})
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
    name: 'status',
    nullable: false,
    default: UserStatus.VERIFYING,
  })
  status: UserStatus;

  @Property({ default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Question, (q) => q.user)
  questions = new Collection<Question>(this);

  // @OneToMany(() => Topic, (t) => t.user)
  // topics = new Collection<Topic>(this);

  @OneToMany(() => History, (h) => h.user)
  histories = new Collection<History>(this);

  @OneToOne()
  profile: Profile;
  // @@@
  @OneToOne()
  points: Point;

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();

}
