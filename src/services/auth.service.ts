import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/constants/errorcode.constant';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { MailService } from 'src/mail/mail.service';
import _ from 'lodash';
//import { User } from 'src/repositories/entities/user.entity';
import { SignupRequest } from 'src/dto';
import { MikroORM } from '@mikro-orm/core';
import { User } from 'src/entities';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
//import { OtpEmail } from 'src/mail/mail-context.interface';
//import { orm } from 'src/orm';


@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly orm: MikroORM,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
   // private mailService: MailService,
  ) {
  }
  async validate(username: string, password: string) {
    throw new Error('Method not implemented.');
  }

  async signup(request: SignupRequest) {
    console.log(request);
    const user = await this.userRepository.find({ email: request.email });
    if (user.length != 0) {
      return {mess: ErrorCode.USER_EXISTED,}
    }
    const _user = await this.userRepository.find({
      username: request.username,
    });
    if (_user.length != 0) {
      return {mess: ErrorCode.USERNAME_EXISTED,}
    }
    if (request.password !== request.confirmPassword) {
      return {mess: ErrorCode.PASSWORD_NOT_MATCH}
    }
    try {
      await (await orm).em.transactional(async em => {
        const hash = await bcrypt.hash(
          request.password,
          this.configService.get('authConfig').saltOrRounds,
        );
        const newUser = this.userRepository.create({
          email: request.email,
          username: request.username,
          password: hash,
        });
        em.persist(newUser);
      });
      return this.login(request.username, request.password);
    } catch (err) {
      console.log(err);
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      email: username,
      username,
    });
    if (!user) {
     return { mess: ErrorCode.USER_NOT_EXIST }
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return {
        mess: ErrorCode.INCORRECT_PASSWORD
      }
    }
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);
    return { token: token };
  }

  // async forgotPassword(email: string) {
  //   const user = await this.userRepository.findOne({ email });
  //   if (!user) {
  //     return { mess: ErrorCode.USER_NOT_EXIST }
  //   }
  //   const otp = _.random(100000, 999999);
  //   const obj: OtpEmail = {
  //     to: email,
  //     otp: otp,
  //   };
  //   await this.mailService.sendMailForgotPassword(obj);
  //   return otp;
  // }

  // async resetPassword(request: ResetPasswordRequest) {
  //   // if (request.otp != request.newOtp) {
  //   //   throw new BadRequestException({
  //   //     code: ErrorCode.INVALID_OTP,
  //   //   });
  //   // }
  //   if (request.newPassword !== request.confirmPassword) {
  //     return {mess: ErrorCode.PASSWORD_NOT_MATCH,}
  //   }
  //   const user = await this.userRepository.findOne({
  //    email: request.email
  //   });
  //   if (!user) {
  //     return {mess: ErrorCode.USER_NOT_EXIST}
  //   }
  //   user.password = await bcrypt.hash(
  //     request.newPassword,
  //     this.configService.get('authConfig').saltOrRounds,
  //   );
  //   await this.connection.manager.save(user);
  // }

  // async changePassword(userId: number, request: ChangePasswordRequest) {
  //   const user = await this.userRepository.findOne({
  //    id: userId
  //   });
  //   if (!user) {
  //     return {mess: ErrorCode.USER_NOT_EXIST,}
  //   }
  //   if (!bcrypt.compareSync(request.password, user.password)) {
  //     return {mess: ErrorCode.INCORRECT_PASSWORD, }
  //   }
  //   if (request.newPassword !== request.confirmPassword) {
  //     return {mess: ErrorCode.PASSWORD_NOT_MATCH,}
  //   }
  //   user.password = await bcrypt.hash(
  //     request.newPassword,
  //     this.configService.get('authConfig').saltOrRounds,
  //   );
  //   await this.connection.manager.save(user);
  // }
}
