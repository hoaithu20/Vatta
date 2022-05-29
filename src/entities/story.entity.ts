import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { QuestionStatus } from "../common/constants";

@Entity({tableName: 'story'})
export class Story {
  @PrimaryKey()
  id: number;

  @Property()
  audio: string;

  @Property()
  img: string;

  @Property()
  title: string;

  @Property({ type: 'text' })
  content: string;

  @Property({ default: QuestionStatus.ACTIVE })
  status: QuestionStatus;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
