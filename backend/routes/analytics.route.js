import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/", protectRoute, adminRoute, (req, res) => { });