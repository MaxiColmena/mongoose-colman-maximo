import Author from "../models/Author.js";

// Crear autor
export const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los autores
export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find({ isActive: true });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un autor por ID
export const getAuthor = async (req, res) => {
  try {
    const author = await Author.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar autor 
export const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!author || !author.isActive) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminación lógica 
export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    
    res.status(200).json({ message: "Autor eliminado", author });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};