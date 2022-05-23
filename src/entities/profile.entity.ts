import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Sex } from "src/constants";
import { User } from "./user.entity";

@Entity({tableName: 'profile'})
export class Profile {
  @PrimaryKey()
  id: number;

  @Property({ nullable: true })
  avatar: string;

  @OneToOne(() => User)
  user: User;

  @Property({ name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Property({ nullable: true })
  sex: Sex;

  @Property({name: 'created_at'})
  createdAt: Date = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

