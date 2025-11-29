const multer = require('multer');
const fs = require('fs');
const { uploadFolder } = require('./paths');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const sapid = req.body.sapid || 'unknown';
    const timestamp = Date.now();
    cb(null, `${sapid}_${timestamp}_${file.originalname}`);
  }
});

module.exports = multer({ storage: storage });
