import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Create a new express router where
const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);
authRouter.get("/profile", protectRoute, getProfile);

export default authRouter;
