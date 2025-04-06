import "dotenv/config";
import express from "express";
const app = express();
import connectToDb from "./config/db.js";
import userRouter from "./routes/user.route.js";
import employeeRouter from "./routes/employee.route.js";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// index route
app.get("/", (req, res) => {
  res.json({ status: "Sucesss", message: "All is well." });
});

// api routes
app.use("/api", userRouter);
app.use("/api/employees", employeeRouter);

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// Starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  await connectToDb();
});
