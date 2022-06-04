import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import lineByLine from 'n-readlines';
import { DictionaryRequest } from 'src/dto';
import { Dictionary } from 'src/entities';

@Injectable()
export class DictionaryService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Dictionary)
    private readonly dictionaryRepo: EntityRepository<Dictionary>,
  ) {}
  async insertData() {
    console.log('Start....');

    const liner = new lineByLine('./eng-viet.txt');
    let line;
    let eng = '';
    let vietnamese: string[] = [];
    let type = '';
    let pronunciation = '';
    while ((line = liner.next())) {
      const text = line.toString() as string;
      if (text.charAt(0) == '@') {
        if (eng != '') {
          this.orm.em.nativeInsert(Dictionary, {
            english: eng,
            vietnamese: vietnamese,
            pronunciation: pronunciation,
            type: type,
          });
          vietnamese = [];
          eng = '';
          pronunciation = '';
        }
        const arr = text.split('/');
        eng = arr[0].substring(1, arr[0].length - 1);
        pronunciation = '/' + `${arr[1]}` + '/';
      } else if (text.charAt(0) == '*') {
        type = text.substring(2);
      } else if (text.charAt(0) == '-') {
        vietnamese.push(text.substring(2, text.length));
      }
    }

    console.log('end of line reached');
  }

  async dictionary(request: DictionaryRequest) {
    const query = await this.dictionaryRepo
      .createQueryBuilder()
      .where({ english: request.search })
      .getSingleResult();
    if (!query) {
      return 'từ bạn cần tìm chưa có trong hệ thống';
    }
    return query;
  }

  async suggestString(request: DictionaryRequest) {
    console.log(request.search);
    const query = await this.dictionaryRepo
      .createQueryBuilder()
      .where({ english: { $like: request.search + '%' } })
      .offset(0)
      .limit(20)
      .getResultList();
    if (!query) {
      return 'từ bạn cần tìm chưa có trong hệ thống';
    }
    return query.map((i) => ({
      english: i.english,
    }));
  }
}
