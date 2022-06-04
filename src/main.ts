import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import swaggerConfig from './common/configs/swagger.config';
import { normalError } from './utils/exception.util';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionFilter } from './common/exceptions/exception.filter';
import { MikroORM } from '@mikro-orm/core';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfig(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        if (errors.length > 0) {
          throw new BadRequestException(normalError(errors));
        }
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  await app.listen(3000);
})();
