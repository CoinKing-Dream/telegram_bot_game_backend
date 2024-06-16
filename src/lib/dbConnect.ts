const mongoose = require("mongoose");
const config = require("../config");

const db: string = config.mongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
