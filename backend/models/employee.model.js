// models/Employee.js
import mongoose, { Schema } from "mongoose";
import Counter from "./counter.model.js";
import { DEPARTMENTS, POSITIONS } from "../constants.js";

const employeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: true,
  },
  position: {
    type: String,
    enum: POSITIONS,
    required: true,
  },
  joiningDate: { type: Date, required: true },
});

employeeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "employeeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedId = String(counter.seq).padStart(4, "0");
    this.employeeId = paddedId;
  }

  next();
});

const Emplyoee = mongoose.model("Emplyoee", employeeSchema);
export default Emplyoee;
