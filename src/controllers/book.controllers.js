import Book from "../models/book.model.js";

// Crear libro 
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    
    // POPULATE para traer datos del autor 
    await book.populate("author");
    
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los libros
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true })
      .populate("author"); // Trae datos del autor
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un libro por ID 
export const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ 
      _id: req.params.id, 
      isAvailable: true 
    }).populate("author");
    
    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar libro
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate("author");
    
    if (!book || !book.isAvailable) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminación lógica 
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      { isAvailable: false }, 
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    
    res.status(200).json({ message: "Libro eliminado", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};