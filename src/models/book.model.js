import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Obligatorio
  },
  isbn: { //  ISBN (International Standard Book Number) es como el documento del libro
    type: String,
    required: true,
    unique: true // No se puede repetir este documento
  },
  // RELACIÓN 1:N - Referencia a Autor
  author: {
    type: mongoose.Schema.Types.ObjectId, //propio del id de Mongo (guarda el id del author)
    ref: "Author", //hace referencia a la colección Author
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true //Eliminación lógica
  }
}, {
  timestamps: true //Añade las fechas automaticamente
});

export default mongoose.model("Book", bookSchema);