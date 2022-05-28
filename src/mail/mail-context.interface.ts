export interface MailContext {
  to: string;
}

export interface OtpEmail extends MailContext {
  otp: number;
}
