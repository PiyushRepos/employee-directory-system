import { Router } from "express";
import { registerHandler } from "../controllers/user.controller.js";
const router = Router();

// prefix - /api

router.post("/register", registerHandler);
