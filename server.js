import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/connectDb.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { corsOptions } from "./config/corsConfig.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGODB_URI;
// connnet to the database
connectDb(url);

//to enable cors
app.use(cors(corsOptions));

//secure apps by setting HTTP response header
app.use(helmet());

app.use(express.static("uploads"));

//to parse json bodies and set limits
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  return res.send("hello this an API for b2c ecommerce");
});
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// server listening
const port = process.env.PORT || 8848;
app.listen(port, () => console.log(`Server started on port ${port}`));
