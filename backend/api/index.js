import connectToDb from "../config/db.js";
import app from "../app.js";

await connectToDb(); // ✅ connect to Mongo once at start
export default app;
