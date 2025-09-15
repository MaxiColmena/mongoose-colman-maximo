import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  content: String,
  rating: Number,
  // RELACIÓN con Book
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  // RELACIÓN con User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Review", reviewSchema);