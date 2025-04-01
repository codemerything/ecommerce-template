import express from "express";
import {
  addToCart,
  getCartItems,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protectRoute, getCartItems);
cartRouter.post("/", protectRoute, addToCart);
cartRouter.delete("/", protectRoute, removeAllFromCart);
cartRouter.delete("/:id", protectRoute, updateQuantity);

export default cartRouter;
