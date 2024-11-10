const express = require("express");
const cors = require("cors");
const connectDb = require("./connection");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const app = express();

(async () => {
  try {
    await connectDb("mongodb://localhost:27017/store");
    console.log("connected to server");
  } catch (error) {
    console.log(error);
  }
})();

//to enable cors
app.use(cors());

//to parse json bodies and set limits
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

//routes
app.get("/", (req, res) => {
  return res.send("hello this an API for b2c ecommerce");
});
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// server listening
const port = 8848;
app.listen(port, () => console.log(`Server started on port ${port}`));
