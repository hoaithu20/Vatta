import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PackagesController } from "src/controllers/package.controller";
import { History, Packages, Point, Question, Week } from "src/entities";
import { PackageService } from "src/services/package.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([Packages, Question, Week, History, Point])
  ],
  providers: [PackageService],
  controllers: [PackagesController],
  exports: [PackageService]
})
export class PackageModule {}