import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    dinoClaps: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Fossil", schema);
