export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  httpConfig: {
    timeout: parseInt(process.env.HTTP_TIMEOUT!, 10) || 30000,
  },
  authConfig: {
    secretKey: process.env.SECRET_KEY,
    expiredToken: process.env.EXPIRED_TOKEN,
    expiredOTP: process.env.EXPIRED_OTP
  }
});
