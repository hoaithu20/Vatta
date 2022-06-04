import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Level, QuestionStatus } from "../common/constants";
import { History } from "./history.entity";
import { Question } from "./question.entity";
import { User } from "./user.entity";

@Entity({tableName: 'package'})
export class Packages {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => History, h => h.package)
  histories = new Collection<History>(this);

  @ManyToMany(() => Question)
  questions = new Collection<Question>(this); // owning side

  // @OneToMany(() => Question, q => q.package)
  // questions: Question[];

  @Property({ default: QuestionStatus.ACTIVE })
  status: QuestionStatus;

  @Property()
  totalQuestion: number;

  @Property({ default: Level.EASY })
  level: Level; // enum

  @Property({ default: false })
  isHidden: boolean;

  @Property()
  timeOut: number;

  @Property({ default: 0 })
  like: number;

  @Property({})
  name: string;

  // @Property({ name: 'question_ids', type: 'json' })
  // questionIds: number[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}


