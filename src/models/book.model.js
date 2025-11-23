import mongoose from "mongoose";
import { model } from "mongoose";

/*
 * Esquema de Libro
 * RELACIÓN 1:N con Author (un autor tiene muchos libros)
 * RELACIÓN N:M con User (muchos usuarios pueden tener muchos libros favoritos)
 */
const bookSchema = new mongoose.Schema({
  // Título del libro
  title: {
    type: String,
    required: true
  },
  // ISBN (International Standard Book Number) - identificador único del libro
  isbn: {
    type: String,
    required: true,
    unique: true  // No se puede repetir este documento
  },
  // RELACIÓN 1:N - Referencia a Autor
  // Un libro pertenece a un autor, un autor tiene muchos libros
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Almacena el ID del autor
    ref: "Author",  // Hace referencia a la colección Author
    required: true
  },
  // RELACIÓN N:M - Referencia a Usuarios que tienen este libro como favorito
  // Muchos usuarios pueden tener muchos libros favoritos
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,  // Array de IDs de usuarios
    ref: "User"  // Hace referencia a la colección User
  }],
  // Campo para eliminación lógica
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Añade automáticamente createdAt y updatedAt
});

export const BookModel = model("Book", bookSchema);
