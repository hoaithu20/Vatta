import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { QuestionHistory } from "./question-history.entity";
import { Packages } from "./package.entity";
import { User } from "./user.entity";

export interface QuestionMap {
  questionId: number;
  answerId: number;
}

@Entity({tableName: 'history'})
export class History {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Packages)
  package: Packages;

  @OneToMany(() => QuestionHistory, qh => qh.history)
  questionHistories = new Collection<QuestionHistory>(this);

  @Property({default: 0})
  point: number;

  @Property({default: 0})
  time: number;

  // @Property({default: true })
  // isCurrent: boolean;

  // @Property({ nullable: true, default: null, type: 'json' })
  // questions: number[];

  @Property({type: 'json', default: null })
  questionMap: QuestionMap[];

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}

