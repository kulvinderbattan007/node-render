import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TestMessage", testSchema);