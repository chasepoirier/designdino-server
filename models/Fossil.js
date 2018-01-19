import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    url: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    headerImage: {
      type: String,
      required: true,
      index: true
    },
    desc: { type: String },
    tags: [{type: String}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Fossil", schema);
