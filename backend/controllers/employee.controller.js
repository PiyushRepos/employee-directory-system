import Employee from "../models/employee.model.js";
import { employeeSchema } from "../Schema/schema.js";
import catchErrors from "../utils/catchErrors.js";

export const createEmployeeHandler = catchErrors(async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can create employees" });
  }

  if (!req.body) {
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
  const employees = await Employee.find({});

  if (employees.length === 0) {
    return res.status(200).json({
      success: true,
      message: "There are no employees in the database",
      data: employees,
    });
  }

  return res.status(200).json({
    success: true,
    data: employees,
    message: "Employee data retrieved successfully",
  });
});
