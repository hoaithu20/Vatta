export enum ErrorCode {
  GENERAL_ERROR = '99',
  BAD_REQUEST = '400',
  SUCCESS = '00',
  UNSUCCESS = '01',
  PAGE_INDEX_NOT_INTEGER = '02',
  PAGE_INDEX_MIN_ONE = '03',
  PAGE_SIZE_NOT_INTEGER = '04',
  PAGE_SIZE_MIN_ONE = '05',
  USER_EXISTED = 'email đã tồn tại',
  USERNAME_EXISTED = 'tên đăng nhập đã tồn tại',
  SIGNUP_FAILED = 'đăng ký thất bại',
  USER_NOT_EXIST = 'người dùng không tồn tại',
  INCORRECT_PASSWORD = 'sai mật khẩu',
  NOT_FOUND_PACKAGE = 'không tìm thấy bộ câu hỏi',
  PASSWORD_NOT_MATCH = 'mật khẩu không khớp',
  INVALID_OTP = 'sai mã otp',
  INVALID_PASSWORD_FORMAT = 'mật khẩu phải gồm 5 ký tự trở lên',
  NOT_FOUND_HISTORY = 'không tìm thấy lịch sử của bộ câu hỏi này',
  ANSWER_NOT_IN_QUESTION = 'câu trả lời không ở trong câu hỏi',
  NOT_FOUND_WEEK = 'không tìm thấy tuần',
  EXPIRED_OTP = 'otp hết hạn',
}