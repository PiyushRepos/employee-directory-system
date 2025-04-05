import { Router } from "express";
import { createEmployeeHandler } from "../controllers/employee.controller";
const router = Router();

// prefix - /api

router.route("/employees").post(createEmployeeHandler);

export default router;
