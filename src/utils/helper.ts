export class ConvertFile {
  static customFileName(req, file, cb) {
    let customFile = file.originalname.split('.')[0] + '-' + Date.now();
    let fileExtention = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtention = '.jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtention = '.png';
    } else if (file.mimetype.indexOf('mpeg') > -1) {
      fileExtention = '.mp3';
    }
    customFile = customFile + fileExtention;
    console.log(customFile);
    cb(null, customFile);
  }
}
