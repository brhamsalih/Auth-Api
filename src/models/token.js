import mongoose from "mongoose";
//Token Schema Models
const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
