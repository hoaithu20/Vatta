import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity({tableName: 'point'})
export class Point {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, {name: 'user_id'})
  user: User;

  @Property({
    name: 'point',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  point: string;

  @Property({ default: 0 })
  week: number;
}
