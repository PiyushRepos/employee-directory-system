import { Router } from "express";
import {
  createEmployeeHandler,
  deleteEmployeeHandler,
  exportEmployeesDataHandler,
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

router.route("/export").get(verifyJwt, exportEmployeesDataHandler);

router
  .route("/:id")
  .get(verifyJwt, getEmployeeByIdHandler)
  .put(verifyJwt, updateEmployeeByIdHandler)
  .delete(verifyJwt, deleteEmployeeHandler);

export default router;
