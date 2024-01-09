import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/image_project/');
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  });
  
const uploadProjectImage = multer({ storage: storage });

export default uploadProjectImage;