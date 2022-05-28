import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { DemoController } from './controllers/demo.controller';
import { DemoService } from './services/demo.service';
import { Answer, Dictionary, Point, Post, User, History, QuestionHistory, Question, Story, Profile, Topic, Week } from 'src/entities';
import { AuthModule } from './modules/auth.module';
import configuration from './common/configs/configuration';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev'],
      load: [configuration],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        dbName: config.get('DB_DATABASE'),
        password: config.get('DB_PASSWORD'),
        highlighter: new SqlHighlighter(),
        debug: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Post, User, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}