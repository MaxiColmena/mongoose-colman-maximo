import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  content: String,
  rating: Number,
  // RELACIÓN N:M - Referencia a Libro
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
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