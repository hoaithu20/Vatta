import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/authentication/jwt.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { User, Post, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week } from 'src/entities';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/services/auth.service';
// import { JwtStrategy } from 'src/security/jwt.strategy';
// import { AuthService } from 'src/services/auth.service';
// import { QuestionsModule } from './questions.module';
// import { PackagesModule } from './packages.module';
// import { MailModule } from 'src/mail/mail.module';
// import { AdminModule } from './admin.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Post, User, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week]
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
