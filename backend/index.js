import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index route
app.get("/", (req, res) => {
  res.json({ status: "Sucesss", message: "All is well." });
});

// Starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
