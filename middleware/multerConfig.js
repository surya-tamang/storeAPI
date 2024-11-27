import multer from "multer";

const storage = multer.diskStorage({
  destination: "../uploads",
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, `${Date.now()}_${sanitizedFilename}`);
  },
});

const upload = multer({ storage });
export default upload;
