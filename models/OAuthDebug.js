import mongoose from "mongoose";

const debugSchema = new mongoose.Schema({
  shop: String,
  code: String,
  responseData: Object,
  errorData: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("OAuthDebug", debugSchema);