import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { DemoController } from './controllers/demo.controller';
import { DemoService } from './services/demo.service';
import { OrmModule } from './modules/orm.module';
import { Answer, Dictionary, Point, Post, User, History, QuestionHistory, Question, Story, Profile, Topic, Week } from 'src/entities';

@Module({
  imports: [
    OrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev'],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        dbName: config.get('DB_DATABASE'),
        password: config.get('DB_PASSWORD'),
        highlighter: new SqlHighlighter(),
        debug: true,
        autoLoadEntities: false,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature({
      entities: [Post, User, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week]
    })
  ],
  controllers: [AppController, DemoController],
  providers: [AppService, DemoService],
})
export class AppModule {}
