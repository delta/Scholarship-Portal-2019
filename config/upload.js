const multer = require('multer');
const path = require('path');
const config=require('./config');
/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: path.resolve(config.dir.ADMIN_BASE_DIR,'public','files','uploads'),
  filename: function(req, file, fn) {
    fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
  }
});

//init
const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: 5000000
  },
  fileFilter: function(req, file, callback) {
    validateFile(file, callback);
  }
}).array('document');


var validateFile = function(file, cb) {
  allowedFileTypes = /pdf/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only PDF files are allowed.")
  }
}


module.exports = upload;
