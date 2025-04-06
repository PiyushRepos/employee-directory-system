import { Router } from "express";
import {
  createEmployeeHandler,
  getAllEmployeesHandler,
} from "../controllers/employee.controller.js";
import verifyJwt from "../middlewares/verifyJwtToken.js";
const router = Router();

// prefix - /api/employees

router
  .route("/")
  .post(verifyJwt, createEmployeeHandler)
  .get(verifyJwt, getAllEmployeesHandler);

export default router;
