import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Level, QuestionStatus } from "../common/constants";
import { History } from "./history.entity";
import { Question } from "./question.entity";
import { User } from "./user.entity";

@Entity({tableName: 'topic'})
export class Topic {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, {name: 'creator_id'})
  user: User;

  @OneToMany(() => History, h => h.topic)
  histories = new Collection<History>(this);

  @OneToMany(() => Question, q => q.topic)
  questions = new Collection<Question>(this);

  @Property({ default: QuestionStatus.ACTIVE })
  status: QuestionStatus;

  @Property({ name: 'total_question' })
  totalQuestion: number;

  @Property({ default: Level.EASY })
  level: Level; // enum

  @Property({ default: false })
  isHidden: boolean;

  @Property({ name: 'time_out' })
  timeOut: number;

  @Property({ default: 0 })
  like: number;

  @Property({})
  name: string;

  // @Property({ name: 'question_ids', type: 'json' })
  // questionIds: number[];

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}
