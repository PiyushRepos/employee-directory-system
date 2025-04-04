import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully:", conn.connection.host);
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

export default connectToDb;
