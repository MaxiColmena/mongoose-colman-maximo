import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nationality: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Author", authorSchema);