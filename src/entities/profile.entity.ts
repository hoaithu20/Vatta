import { Collection, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Sex } from "src/common/constants";
import { User } from "./user.entity";

@Entity({tableName: 'profile'})
export class Profile {
  @PrimaryKey()
  id: number;

  @Property({ nullable: true })
  avatar: string;

  @OneToOne(() => User)
  user: User;

  @Property({ nullable: true })
  dateOfBirth: Date;

  @Property({ nullable: true })
  sex: Sex;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

