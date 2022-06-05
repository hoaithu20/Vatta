import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { WeekStatus } from '../common/constants';

@Entity({ tableName: 'week' })
export class Week {
  @PrimaryKey()
  id: number;

  @Property({ default: 'ACTIVE' })
  status: WeekStatus;

  @Property({nullable: true})
  startTime: Date;

  @Property({nullable: true})
  endTime: Date;

  @Property()
  week: string;
}
