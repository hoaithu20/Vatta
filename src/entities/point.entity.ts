import { WeekStatus } from 'src/constants/week-status.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

@Entity('point')
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.points)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((p: Point) => p.user)
  userId: number;

  @Column({
    name: 'point',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  point: string;

  @Column({ default: 0 })
  week: number;
}
