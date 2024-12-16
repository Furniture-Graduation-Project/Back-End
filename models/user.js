import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    avatar: { type: String, default: "" },
    phone: { type: String },
    refreshToken: { type: String },
    account: {
      google: {
        id: { type: String },
        token: { type: String },
        refreshToken: { type: String },
      },
      facebook: {
        id: { type: String },
        token: { type: String },
        refreshToken: { type: String },
      },
    },
    wishlist: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    locations: [
      {
        addressName: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String },
        country: { type: String },
        city: { type: String },
        district: { type: String },
        ward: { type: String },
        street: { type: String },
        default: { type: Boolean, default: false },
      },
    ],
    active: { type: Boolean, default: true },
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
