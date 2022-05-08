import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { History } from "./history.entity";

@Entity({tableName: 'question_history'})
export class QuestionHistory {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => History, {name: 'history_id'})
  history: History;

  @Property({name: 'question_id'})
  questionId: number;

  @Property({name: 'answer_id'})
  answerId: number;
}