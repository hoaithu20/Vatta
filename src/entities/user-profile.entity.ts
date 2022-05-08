import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity({tableName: 'user-profile'})
export class Profile {
  @PrimaryKey()
  id: number;

  @Property({ nullable: true })
  avatar: string;

  @OneToOne({name: 'user_id'})
  user: User;

  @Property({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Property({ nullable: true })
  sex: string;

  @Property({name: 'created_at'})
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}

