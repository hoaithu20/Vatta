import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'otp' })
export class Otp {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property()
  otp: number;

  @Property()
  expiryTime: Date;
}
