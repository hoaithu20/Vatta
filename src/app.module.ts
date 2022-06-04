import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import {
  Answer,
  Dictionary,
  Point,
  User,
  History,
  Question,
  Story,
  Profile,
  Week,
  Packages,
} from 'src/entities';
import { AuthModule } from './modules/auth.module';
import configuration from './common/configs/configuration';
import { UserModule } from './modules/user.module';
import { PackageModule } from './modules/package.module';
import { QuestionModule } from './modules/question.module';
import { DictionaryModule } from './modules/dictionary.module';
import { AdminModule } from './modules/admin.module';

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
    MikroOrmModule.forFeature([
      User,
      Answer,
      Dictionary,
      History,
      Point,
      Question,
      Story,
      Packages,
      Profile,
      Week,
    ]),
    AuthModule,
    UserModule,
    PackageModule,
    QuestionModule,
    DictionaryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
