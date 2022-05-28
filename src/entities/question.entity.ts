import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Level, QuestionStatus } from "../common/constants";
import { Answer } from "./answer.entity";
import { Topic } from "./topic.entity";
import { User } from "./user.entity";

@Entity({tableName: 'question'})
export class Question{
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, {name: 'creator_id'})
  user: User;

  @OneToMany(() => Answer, (a) => a.question)
  answers = new Collection<Answer>(this);

  @ManyToOne(() => Topic, {name: 'topic_id'})
  topic: Topic;

  @Property()
  title: string;

  @Property({ default: QuestionStatus.ACTIVE })
  status: QuestionStatus; // add enum;

  @Property({ default: Level.EASY })
  level: Level;

  @Property({ default: false })
  isHidden: boolean;

  @Property({ default: 0 })
  like: number;

  @Property({ name: 'total_answer' })
  totalAnswer: number;

  @Property({ name: 'correct_answer', default: 0 })
  correctAnswer: number;

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}
