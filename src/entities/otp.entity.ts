import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({tableName: 'otp'})
export class Otp {
  @PrimaryKey()
  id: number;

  @Property({name: 'user_id'})
  userId: number;

  @Property()
  otp: number;

  @Property()
  expiryTime: Date;

}