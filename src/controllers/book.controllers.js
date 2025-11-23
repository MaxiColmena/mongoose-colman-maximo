import { BookModel } from "../models/book.model.js";
import { ReviewModel } from "../models/review.model.js";

export const createBook = async (req, res) => {
  try {
    // Crear nueva instancia del modelo Book con los datos del body
    const book = new BookModel(req.body);
    // Guardar el libro en la base de datos
    await book.save();
    
    // POPULATE: Traer datos completos del autor relacionado
    await book.populate("author");
    
    // Retornar el libro creado con código 201 (Created)
    res.status(201).json({
      message: "Libro creado exitosamente",
      book
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al crear libro",
      details: error.message 
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    // Buscar todos los libros disponibles con populate del autor
    // POPULATE: Trae los datos completos del autor en lugar de solo el ID
    const books = await BookModel.find({ isAvailable: true })
      .populate("author")  // Trae datos del autor
      .populate("favoritedBy", "name email");  // Trae datos básicos de usuarios que lo tienen como favorito
    
    // Retornar la lista de libros con código 200 (OK)
    res.status(200).json({
      message: "Libros obtenidos exitosamente",
      count: books.length,
      books
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener libros",
      details: error.message 
    });
  }
};

export const getBook = async (req, res) => {
  try {
    // Buscar libro por ID que esté disponible
    // POPULATE: Trae los datos completos del autor y usuarios que lo tienen como favorito
    const book = await BookModel.findOne({ 
      _id: req.params.id, 
      isAvailable: true 
    })
      .populate("author")  // Trae datos del autor
      .populate("favoritedBy", "name email");  // Trae datos básicos de usuarios
    
    // Si no se encuentra el libro, retornar 404 (Not Found)
    if (!book) {
      return res.status(404).json({ 
        error: "Libro no encontrado" 
      });
    }
    
    // Retornar el libro encontrado con código 200 (OK)
    res.status(200).json({
      message: "Libro obtenido exitosamente",
      book
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener libro",
      details: error.message 
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    // Buscar y actualizar el libro por ID
    // new: true retorna el documento actualizado
    const book = await BookModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }  // runValidators ejecuta las validaciones del schema
    )
      .populate("author")  // Trae datos del autor
      .populate("favoritedBy", "name email");  // Trae datos básicos de usuarios
    
    // Si no se encuentra el libro o no está disponible, retornar 404
    if (!book || !book.isAvailable) {
      return res.status(404).json({ 
        error: "Libro no encontrado" 
      });
    }
    
    // Retornar el libro actualizado con código 200 (OK)
    res.status(200).json({
      message: "Libro actualizado exitosamente",
      book
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al actualizar libro",
      details: error.message 
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    // Buscar el libro por ID
    const book = await BookModel.findById(req.params.id);
    
    // Si no se encuentra el libro, retornar 404
    if (!book) {
      return res.status(404).json({ 
        error: "Libro no encontrado" 
      });
    }
    
    // ELIMINACIÓN EN CASCADA
    
    // 1. Eliminar lógicamente todas las reseñas del libro (relación 1:N)
    await ReviewModel.updateMany(
      { book: req.params.id },
      { isActive: false }
    );
    
    // 2. Eliminar lógicamente el libro
    book.isAvailable = false;
    await book.save();
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Libro eliminado exitosamente (eliminación en cascada aplicada)",
      book 
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al eliminar libro",
      details: error.message 
    });
  }
};

export const addBookToFavorites = async (req, res) => {
  try {
    const { bookId, userId } = req.params;
    
    // Buscar el libro por ID
    const book = await BookModel.findById(bookId);
    
    // Si no se encuentra el libro, retornar 404
    if (!book || !book.isAvailable) {
      return res.status(404).json({ 
        error: "Libro no encontrado" 
      });
    }
    
    // Verificar si el usuario ya tiene el libro en favoritos
    if (book.favoritedBy.includes(userId)) {
      return res.status(400).json({ 
        error: "El libro ya está en los favoritos del usuario" 
      });
    }
    
    // Agregar el usuario a la lista de favoritos del libro
    // $addToSet agrega el elemento solo si no existe (evita duplicados)
    await BookModel.findByIdAndUpdate(
      bookId,
      { $addToSet: { favoritedBy: userId } },  // $addToSet agrega solo si no existe
      { new: true }
    );
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Libro agregado a favoritos exitosamente"
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al agregar libro a favoritos",
      details: error.message 
    });
  }
};

export const removeBookFromFavorites = async (req, res) => {
  try {
    const { bookId, userId } = req.params;
    
    // Buscar el libro por ID
    const book = await BookModel.findById(bookId);
    
    // Si no se encuentra el libro, retornar 404
    if (!book || !book.isAvailable) {
      return res.status(404).json({ 
        error: "Libro no encontrado" 
      });
    }
    
    // Remover el usuario de la lista de favoritos del libro
    // $pull remueve el elemento del array
    await BookModel.findByIdAndUpdate(
      bookId,
      { $pull: { favoritedBy: userId } },  // $pull remueve el elemento del array
      { new: true }
    );
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Libro removido de favoritos exitosamente"
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al remover libro de favoritos",
      details: error.message 
    });
  }
};
