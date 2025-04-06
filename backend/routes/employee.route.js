import { Router } from "express";
import {
  createEmployeeHandler,
  getAllEmployeesHandler,
  getEmployeeByIdHandler,
  updateEmployeeByIdHandler,
} from "../controllers/employee.controller.js";
import verifyJwt from "../middlewares/verifyJwtToken.js";
const router = Router();

// prefix - /api/employees

router
  .route("/")
  .post(verifyJwt, createEmployeeHandler)
  .get(verifyJwt, getAllEmployeesHandler);

router
  .route("/:id")
  .get(verifyJwt, getEmployeeByIdHandler)
  .put(verifyJwt, updateEmployeeByIdHandler);

export default router;
