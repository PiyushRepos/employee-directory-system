import mongoose from "mongoose";
import initData from "./data.js";
import Employee from "../models/employee.model.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/eds";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Employee.deleteMany({});
  //   initData.data = initData.data.map((obj) => ({
  //     ...obj,
  //     owner: "677ea7b59dbb1b07da1325be",
  //   }));
  //   await Listing.insertMany(initData.data);
  for (const employee of initData) {
    const newEmp = new Employee(employee);
    await newEmp.save(); // triggers pre-save hook ✅
  }
  console.log("Data was initialized");
};

initDB();
