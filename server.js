import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/connectDb.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const url =
  "mongodb+srv://tmgsurya055:Dx0fpw6YDG8CSiAR@store.g6oyf.mongodb.net/store?retryWrites=true&w=majority&appName=store";

// connnet to the database
connectDb(url);

//to enable cors
app.use(
  cors({
    // origin: "*",
    origin: "http://localhost:4000",
    credentials: true,
  })
);

app.use(express.static("uploads"));

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

// server listening
const port = process.env.PORT || 8848;
app.listen(port, () => console.log(`Server started on port ${port}`));
