import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserController } from "src/controllers/user.controller";
import { User } from "src/entities";
import { UserService } from "src/services/user.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([User])
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}