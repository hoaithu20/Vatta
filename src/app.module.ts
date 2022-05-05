import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Post } from './entities';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { DemoController } from './controllers/demo.controller';
import { DemoService } from './services/demo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev'],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        dbName: config.get('DB_NAME'),
        password: config.get('DB_PASSWORD'),
        highlighter: new SqlHighlighter(),
        debug: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Post]),
  ],
  controllers: [AppController, DemoController],
  providers: [AppService, DemoService],
})
export class AppModule {}
