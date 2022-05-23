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

@Module({
  imports: [
    JwtModule.register({
      secret: 'vatta',
      signOptions: {
        expiresIn: '100d',
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
