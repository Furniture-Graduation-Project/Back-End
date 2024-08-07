import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String },
        password: { type: String },
        avatar: { type: String },
        phone: { type: String },
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
    },
    { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
