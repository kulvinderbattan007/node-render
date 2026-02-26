import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  shop: String,
  accessToken: String,

  // 👉 TEST FIELDS
  code: String,
  apiKey: String,
  apiSecret: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Shop", shopSchema);