import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { connectDb } from "./connection/index.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
const app = express();
const url = "mongodb://localhost:27017/store";
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 100);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// connnet to the database
connectDb(url);

//to enable cors
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use("/uploads", express.static("public/data/uploads"));

//to parse json bodies and set limits
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  return res.send("hello this an API for b2c ecommerce");
});
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.post("/profile", upload.single("image"), function (req, res, next) {
  try {
    return res
      .status(200)
      .json({ msg: "File uploaded success", file: req.file });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// server listening
const port = 8848;
app.listen(port, () => console.log(`Server started on port ${port}`));
