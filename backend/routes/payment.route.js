import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/", protectRoute, initializePayment);
paymentRouter.get("/callback", verifyPayment);

export default paymentRouter;
