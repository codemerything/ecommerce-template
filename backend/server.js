// Import express and dotenv
import express from "express";
import cookieParser from "cookie-parser";

// Import routes from routes folder
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
// import analyticsRoutes from "./routes/analytics.route.js";

// Import the database connection function from db.js

import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";

// Create an express app
const app = express();

// parse body of the request to json
app.use(express.json());
app.use(cookieParser());

// Mount the authRoutes middleware on the "/api/auth" path.
// Any requests starting with "/api/auth" will be routed to the handlers defined in authRoutes.

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
// app.use("/api/analytics", analyticsRoutes);
// Starts the server and makes the app accessible on the specified PORT.
//  Without this, the app won't handle requests.
// Also added the connectDB function to connect to the database when the server starts.
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);

  connectDB();
});
