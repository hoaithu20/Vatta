import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { QuestionHistory } from "./question-history.entity";
import { Topic } from "./topic.entity";
import { User } from "./user.entity";

export interface QuestionMap {
  [questionId: number]: number;
}

@Entity({tableName: 'history'})
export class History {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, {name: 'user_id'})
  user: User;

  @ManyToOne(() => Topic, {name: 'topic_id'})
  topic: Topic;

  @OneToMany(() => QuestionHistory, qh => qh.history)
  questionHistories = new Collection<QuestionHistory>(this);

  @Property({
    name: 'point',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  point: string;

  @Property({ name: 'is_current', default: true })
  isCurrent: boolean;

  // @Property({ nullable: true, default: null, type: 'json' })
  // questions: number[];

  // @Property({ name: 'question_map', type: 'json', default: null })
  // questionMap: QuestionMap[];

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}

