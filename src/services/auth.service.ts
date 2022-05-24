import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/constants/errorcode.constant';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { SignupRequest } from 'src/dto';
import { MikroORM } from '@mikro-orm/core';
import { Profile, User } from 'src/entities';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MailService } from 'src/mail/mail.service';
import { OtpEmail } from 'src/mail/mail-context.interface';
import { Otp } from 'src/entities/otp.entity';
import { ChangePasswordRequest, CheckOtpRequest, ResetPasswordRequest} from 'src/dto/forgot-pass.request';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly orm: MikroORM,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    @InjectRepository(Otp)
    private readonly otpRepository: EntityRepository<Otp>,
  ) {
  }
  async validate(username: string, password: string) {
    throw new Error('Method not implemented.');
  }

  async signup(request: SignupRequest) {
    const {email, username} = request
    console.log(request);
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return {mess: ErrorCode.USER_EXISTED,}
    }
    const _user = await this.userRepository.findOne({ username });
    
    if (_user) {
      return {mess: ErrorCode.USERNAME_EXISTED,}
    }
    if (request.password !== request.confirmPassword) {
      return {mess: ErrorCode.PASSWORD_NOT_MATCH}
    }
    try {
        const password = await bcrypt.hash(
          request.password,
          10
        );
        const newUser = this.userRepository.create({
          email: request.email,
          username: request.username,
          password,
        });
        const profile = this.profileRepository.create({
          user: newUser,
        })
        await this.orm.em.persistAndFlush([newUser, profile]);

      return this.login(request.username, request.password);
    } catch (err) {
      console.log(err);
      throw new BadRequestException({
        code: ErrorCode.UNSUCCESS,
      });
    }
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ $or: [{ username }, { email: username }] });
    console.log(user)
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

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return { mess: ErrorCode.USER_NOT_EXIST }
    }
    const otp = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;;
    const obj: OtpEmail = {
      to: email,
      otp: otp,
    };
    await this.mailService.sendMailForgotPassword(obj);
    const otpEntity = this.otpRepository.create({
      otp,
      email: user.email,
      expiryTime: new Date(new Date().getTime() + 1000*Number(this.configService.get('authConfig').expiredOTP))
    })
    await this.orm.em.persistAndFlush(otpEntity);
    return user.id;
  }

  async checkOtp(input: CheckOtpRequest) {
    const otp = await this.otpRepository.findOne({ $and: [{ email: input.email }, {otp: input.otp}] });
    if(!otp || otp.expiryTime < new Date()) {
      return false;
    }
    return true;
  }

  async resetPassword(input: ResetPasswordRequest) {
    const {email, newPassword, confirmPassword} = input;
    if(newPassword !== confirmPassword) {
      return { mess: ErrorCode.PASSWORD_NOT_MATCH }
    }
    const user = await this.userRepository.findOne({email})
    if(!user) {
      return {mess: ErrorCode.USER_NOT_EXIST}
    }
    user.password = await bcrypt.hash(
      newPassword,
      10,
    );
    await this.orm.em.flush();
  }

  async changePassword(userId: number, request: ChangePasswordRequest) {
    const user = await this.userRepository.findOne({
      id: userId
    });
    if (!user) {
      return {mess: ErrorCode.USER_NOT_EXIST,}
    }
    if (!bcrypt.compareSync(request.password, user.password)) {
      return {mess: ErrorCode.INCORRECT_PASSWORD, }
    }
    if (request.newPassword !== request.confirmPassword) {
      return {mess: ErrorCode.PASSWORD_NOT_MATCH,}
    }
    user.password = await bcrypt.hash(
      request.newPassword,
      10,
    );
    await this.orm.em.flush();
  }
}
