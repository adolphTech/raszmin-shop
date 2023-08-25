import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"
dotenv.config();

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"

const port = process.env.PORT || 5000;

connectDB(); //mongodb connection
const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running ...");
});

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload",uploadRoutes)

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use("/uploads",express.static(path.join(__dirname,"/uploads")))

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server API running on ${port}`);
});
