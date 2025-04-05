import { Router } from "express";
import {
  getCurrentLoggedInUserHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/verifyJwtToken.js";
const router = Router();

// prefix - /api

router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);
router.route("/me").get(verifyJwt, getCurrentLoggedInUserHandler);
router.route("/logout").post(verifyJwt, logoutHandler);

export default router;
