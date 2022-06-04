import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { Profile, User } from 'src/entities';
import { Otp } from 'src/entities/otp.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthService } from 'src/services/auth.service';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRED_TOKEN,
      },
    }),
    MikroOrmModule.forFeature([User, Profile, Otp]),
    ConfigModule,
    PassportModule,
    MailModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
