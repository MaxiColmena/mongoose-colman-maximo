import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  // RELACIÓN 1:N - Referencia a Autor
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Book", bookSchema);