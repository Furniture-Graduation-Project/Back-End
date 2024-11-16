import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false }
);

const MaterialModel = mongoose.model("Material", materialSchema);
export default MaterialModel;
