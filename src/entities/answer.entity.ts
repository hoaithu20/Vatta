import {Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Question } from "./question.entity";

@Entity({tableName: 'answer'})
export class Answer{
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  content: string;

  @Property({ default: null, nullable: true })
  description: string;

  @Property()
  isTrue: boolean;

  @ManyToOne(() => Question)
  question: Question;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
