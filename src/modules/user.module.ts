import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UserController } from "src/controllers/user.controller";
import { User } from "src/entities";
import { UserService } from "src/services/user.service";
import { ConvertFile } from "src/utils/helper";

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          filename: ConvertFile.customFileName,
          destination: './upload',
        }),
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}