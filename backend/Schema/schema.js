import { z } from "zod";
import { DEPARTMENTS, POSITIONS } from "../constants.js";

export const registerSchema = z
  .object({
    fullName: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(4, { message: "Full name must be 4 or more characters long" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "password must be 6 or more characters long"),
  })
  .required();

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "password must be 6 or more characters long"),
  })
  .required();

export const employeeSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .length(10, "Phone number must be of 10 digits")
      .optional(),
    department: z.enum(DEPARTMENTS),
    position: z.enum(POSITIONS),
    joiningDate: z.preprocess(
      (val) => new Date(val),
      z.date({
        required_error: "Select a correct joining date",
        invalid_type_error: "That's not a date. Invalid date type",
      })
    ),
  })
  .required();

export const updateEmployeeSchema = employeeSchema.partial();
