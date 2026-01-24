import mongoose from "mongoose";

const sharedWithSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["viewer", "editor"], required: true }
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: [sharedWithSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
