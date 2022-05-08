import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { QuestionStatus } from "../constants";

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

  @Property({ name: 'created_at' })
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}
