import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

if (!global.mongoose) {
  global.mongoose = {
    connection: null,
    promise: null,
  };
}

const cached = global.mongoose;

const connectToDb = async () => {
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then(() => mongoose.connection);
  }
  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(error);
    throw error;
  }
  return cached.connection;
};

export default connectToDb;
