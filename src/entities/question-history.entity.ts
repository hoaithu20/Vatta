import { Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { History } from "./history.entity";

@Entity({tableName: 'question_history'})
export class QuestionHistory {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => History)
  history =  new Collection<History>(this);

  @Property()
  questionId: number;

  @Property()
  answerId: number;
}