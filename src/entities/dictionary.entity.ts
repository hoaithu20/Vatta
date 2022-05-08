import { Entity, Index, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({tableName: 'dictionary'})
export class Dictionary {
  @PrimaryKey()
  id: number;

  @Property()
  @Index()
  english: string;
 
  @Property()
  type: string;

  @Property()
  pronunciation: string;

  @Property({type: 'json'})
  vietnamese: string[];
}
