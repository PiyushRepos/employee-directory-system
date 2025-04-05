import "dotenv/config";
import express from "express";
const app = express();
import connectToDb from "./config/db.js";
import userRouter from "./routes/user.route.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index route
app.get("/", (req, res) => {
  res.json({ status: "Sucesss", message: "All is well." });
});

// api routes
app.use("/api", userRouter);

app.use((err, req, res, next) => {
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Erorrr" });
});

// Starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  await connectToDb();
});
