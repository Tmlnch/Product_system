import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI undefined");
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
      })
      .then(() => console.log("MongoDB connected succesfully"))
      .catch(err => console.error("MongoDB connection failed:", err));
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;