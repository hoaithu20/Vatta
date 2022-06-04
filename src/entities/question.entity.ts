import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Level, QuestionStatus } from '../common/constants';
import { Answer } from './answer.entity';
import { Packages } from './package.entity';
import { User } from './user.entity';

@Entity({ tableName: 'question' })
export class Question {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Answer, (a) => a.question)
  answers = new Collection<Answer>(this);

  @ManyToMany(() => Packages, (p) => p.questions)
  packages = new Collection<Packages>(this);

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

  @Property()
  totalAnswer: number;

  // @OneToOne(() => Answer)
  // correctAnswer: Answer;

  @Property({ default: 0 })
  correctAnswer: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
