export const multerOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  },
};
