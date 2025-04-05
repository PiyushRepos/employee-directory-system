import { Router } from "express";
import { createEmployeeHandler } from "../controllers/employee.controller.js";
import verifyJwt from "../middlewares/verifyJwtToken.js";
const router = Router();

// prefix - /api

router.route("/employees").post(verifyJwt, createEmployeeHandler);

export default router;
