import { Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity({tableName: 'point'})
export class Point {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user = new Collection<User>(this);

  @Property({default: 0})
  point: number;

  @Property({ default: 0 })
  week: number;

  constructor(user: User, point: number, week: number) {
    this.user.add(user);
    this.point = point;
    this.week = week;
  }
}
