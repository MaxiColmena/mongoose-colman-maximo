import mongoose from "mongoose";
import { model } from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // OBLIGATORIO en verdadero (true)
  },
  nationality: String, // Opcional
  isActive: {
    type: Boolean,
    default: true // Para eliminación lógica
  }
}, {
  timestamps: true // Crea createdAt y updatedAt 
});

export const AuthorModel = model("Author", authorSchema);
