//uploadImageMiddleware.js
const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") cb(null, true);
    else cb(new ApiError("accept images only", 400), false);
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};

exports.uploadImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMixOfImages = () => {
  return multerOptions().fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]);
};
