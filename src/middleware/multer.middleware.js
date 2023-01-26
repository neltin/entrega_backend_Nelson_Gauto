const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../public/img'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

module.exports ={ Uploader: multer({ storage }) };