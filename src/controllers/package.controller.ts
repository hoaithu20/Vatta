import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PackageService } from "src/services/package.service";

@ApiTags('api/package')
@Controller('api/package')
export class PackageController {
  constructor(
    private readonly packageService: PackageService,
  ) {}
}