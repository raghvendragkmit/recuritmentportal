const multer = require('multer');
const fileStorage = multer.diskStorage({
  // Destination to store file
  destination: 'uploads',
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const fileUpload = multer({
  storage: fileStorage,
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.xlsx/)) {
      // upload only xlsx file
      return callback(undefined, false);
    }
    callback(undefined, true);
  }
});

module.exports = {
  fileUpload
};
