import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PackageController } from "src/controllers/package.controller";
import { Packages } from "src/entities";
import { PackageService } from "src/services/package.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([Packages])
  ],
  providers: [PackageService],
  controllers: [PackageController],
  exports: [PackageService]
})
export class TopicModule {}