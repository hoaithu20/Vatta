import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DictionaryController } from 'src/controllers/dictionary.controller';
import { Dictionary } from 'src/entities';
import { DictionaryService } from 'src/services/dictionnary.service';

@Module({
  imports: [MikroOrmModule.forFeature([Dictionary])],
  providers: [DictionaryService],
  controllers: [DictionaryController],
  exports: [DictionaryService],
})
export class DictionaryModule {}
