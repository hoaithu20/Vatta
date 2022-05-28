import {Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Question } from "./question.entity";

@Entity({tableName: 'answer'})
export class Answer{
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  content: string;

  @Property({ default: null, nullable: true })
  description: string;

  @Property({ name: 'is_true' })
  isTrue: boolean;

  @ManyToOne(() => Question, {name: 'question_id'})
  question: Question;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
