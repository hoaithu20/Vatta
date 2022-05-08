import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WeekStatus } from "../constants";

@Entity({tableName: 'week'})
export class Week {
  @PrimaryKey()
  id: number;

  @Property({ default: 1 })
  status: WeekStatus;

  @Property({ name: 'start_time' })
  startTime: Date;

  @Property({ name: 'end_time' })
  endTime: Date;

  @Property()
  week: string;
}
