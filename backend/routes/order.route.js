import express from "express";
import { getCustomerStats } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const orderRouter = express.Router();
orderRouter.get("/customer-stats", protectRoute, getCustomerStats);

export default orderRouter;
// This code defines an Express router for handling order-related routes.
