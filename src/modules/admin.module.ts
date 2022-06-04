import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminController } from 'src/controllers/admin.controller';
import { Question, Story } from 'src/entities';
import { AdminService } from 'src/services/admin.service';
import { ConvertFile } from 'src/utils/helper';

@Module({
  imports: [
    MikroOrmModule.forFeature([Story, Question]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          filename: ConvertFile.customFileName,
          destination: './upload',
        }),
      }),
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
