var multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
// SET STORAGE

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/UserAvatars')
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4()+Date.now().toString()+'-'+file.originalname);

    }
  })
   
var upload = multer({ storage: storage })

module.exports = upload;