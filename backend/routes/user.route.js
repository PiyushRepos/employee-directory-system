import { Router } from "express";
import {
  loginHandler,
  registerHandler,
} from "../controllers/user.controller.js";
const router = Router();

// prefix - /api

router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);

export default router;
