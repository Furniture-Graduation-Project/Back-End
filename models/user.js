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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    locations: [
      {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
        recipientName: { type: String },
        phoneNumber: { type: String },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
