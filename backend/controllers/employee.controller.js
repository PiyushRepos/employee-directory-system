import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import { employeeSchema, updateEmployeeSchema } from "../Schema/schema.js";
import catchErrors from "../utils/catchErrors.js";
import { Parser } from "@json2csv/plainjs";

export const createEmployeeHandler = catchErrors(async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can create employees" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const data = employeeSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      success: false,
      error: { message: data.error.issues[0].message },
    });
  }

  const {
    data: { name, email, phoneNumber, department, position, joiningDate },
  } = data;

  try {
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exist",
      });
    }

    let newEmployee = new Employee({
      name,
      email,
      phoneNumber,
      department,
      position,
      joiningDate,
    });

    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "New employee added successfully",
      employeeId: newEmployee.employeeId,
    });
  } catch (error) {
    console.error("Error while creating new employee", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export const getAllEmployeesHandler = catchErrors(async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const skip = (validPage - 1) * validLimit;

  const totalEmployees = await Employee.countDocuments();
  const pages = Math.ceil(totalEmployees / validLimit);

  if (validPage > pages && pages !== 0) {
    return res
      .status(400)
      .json({ success: false, message: "Select a valid page" });
  }

  const employees = await Employee.find().skip(skip).limit(validLimit);

  return res.status(200).json({
    pagination: {
      total: totalEmployees,
      page: validPage,
      limit: validLimit,
      pages,
    },
    success: true,
    message: employees.length
      ? "Employee data retrieved successfully"
      : "There are no employees in the database",
    data: employees,
  });
});

export const getEmployeeByIdHandler = catchErrors(async (req, res) => {
  const id = req.params?.id;

  let employee;

  if (mongoose.isValidObjectId(id)) {
    employee = await Employee.findById(id);
  }

  if (!employee && typeof id === "string" && id.length === 4) {
    employee = await Employee.findOne({ employeeId: id });
  }

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Employee retrieved successfully",
    data: employee,
  });
});

export const updateEmployeeByIdHandler = catchErrors(async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can update employees" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Updation fields are required" });
  }

  const id = req.params?.id;
  let employee;

  if (mongoose.isValidObjectId(id)) {
    employee = await Employee.findById(id);
  }

  if (!employee && typeof id === "string" && id.length === 4) {
    employee = await Employee.findOne({ employeeId: id });
  }

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  const data = updateEmployeeSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      success: false,
      error: { message: data.error.issues[0].message },
    });
  }

  const {
    data: { name, email, phoneNumber, department, position, joiningDate },
  } = data;

  const updatedEmployee = await Employee.findByIdAndUpdate(
    employee._id,
    {
      name: name || employee.name,
      email: email || employee.email,
      phoneNumber: phoneNumber || employee.phoneNumber,
      position: position || employee.position,
      department: department || employee.department,
      joiningDate: joiningDate || employee.joiningDate,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Employee information updated successfully",
    data: updatedEmployee,
  });
});

export const deleteEmployeeHandler = catchErrors(async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can delete employees" });
  }

  const id = req.params?.id;
  let employee;

  if (mongoose.isValidObjectId(id)) {
    employee = await Employee.findById(id);
  }

  if (!employee && typeof id === "string" && id.length === 4) {
    employee = await Employee.findOne({ employeeId: id });
  }

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  await Employee.findByIdAndDelete(employee._id);

  return res
    .status(200)
    .json({ success: true, message: "Employee deleted successfully" });
});

export const exportEmployeesDataHandler = catchErrors(async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can access this route" });
  }

  const type = req.query?.type?.toLowerCase() || "json";

  const employees = await Employee.find({});

  if (!employees.length) {
    return res.status(404).json({
      success: false,
      message: "No employee data available to export",
    });
  }

  const fields = [
    "employeeId",
    "name",
    "email",
    "phoneNumber",
    "department",
    "position",
    "joiningDate",
  ];

  if (type === "csv") {
    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(employees);

      res.header("Content-Type", "text/csv");
      res.attachment("employees.csv");

      return res.status(200).send(csv);
    } catch (err) {
      console.error("Error while parsing CSV", err);
      return res.status(500).json({
        success: false,
        message: "Failed to export CSV",
      });
    }
  }

  res.header("Content-Type", "application/json");
  res.attachment("employees.json");
  return res.status(200).json({ employees });
});
