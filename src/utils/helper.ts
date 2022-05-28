export class ConvertFile {
  static customFileName(req, file, cb) {
    let customFile = Date.now()+ '_' + randomString(5);
    let fileExtention = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtention = '.jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtention = '.png';
    } else if (file.mimetype.indexOf('mpeg') > -1) {
      fileExtention = '.mp3';
    }
    customFile = customFile + fileExtention;
    cb(null, customFile);
  }
}

export function randomString(length = 40) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
