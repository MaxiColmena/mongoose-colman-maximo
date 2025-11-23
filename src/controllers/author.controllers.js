import { AuthorModel } from "../models/author.model.js";
import { BookModel } from "../models/book.model.js";
import { ReviewModel } from "../models/review.model.js";

export const createAuthor = async (req, res) => {
  try {
    // Crear nueva instancia del modelo Author con los datos del body
    const author = new AuthorModel(req.body);
    // Guardar el autor en la base de datos
    await author.save();
    // Retornar el autor creado con código 201 (Created)
    res.status(201).json({
      message: "Autor creado exitosamente",
      author
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al crear autor",
      details: error.message 
    });
  }
};


export const getAllAuthors = async (req, res) => {
  try {
    // Buscar todos los autores con isActive = true
    const authors = await AuthorModel.find({ isActive: true });
    // Retornar la lista de autores con código 200 (OK)
    res.status(200).json({
      message: "Autores obtenidos exitosamente",
      count: authors.length,
      authors
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener autores",
      details: error.message 
    });
  }
};

export const getAuthor = async (req, res) => {
  try {
    // Buscar autor por ID que esté activo
    const author = await AuthorModel.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    // Si no se encuentra el autor, retornar 404 (Not Found)
    if (!author) {
      return res.status(404).json({ 
        error: "Autor no encontrado" 
      });
    }
    
    // POPULATE INVERSO: Obtener todos los libros de este autor
    // Como Book tiene referencia a Author, buscamos los libros que referencian este autor
    const books = await BookModel.find({ 
      author: req.params.id,
      isAvailable: true 
    }).populate("author");
    
    // Retornar el autor con sus libros relacionados con código 200 (OK)
    res.status(200).json({
      message: "Autor obtenido exitosamente",
      author,
      books: {
        count: books.length,
        items: books
      }
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener autor",
      details: error.message 
    });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    // Buscar y actualizar el autor por ID
    // new: true retorna el documento actualizado
    const author = await AuthorModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }  // runValidators ejecuta las validaciones del schema
    );
    
    // Si no se encuentra el autor o no está activo, retornar 404
    if (!author || !author.isActive) {
      return res.status(404).json({ 
        error: "Autor no encontrado" 
      });
    }
    
    // Retornar el autor actualizado con código 200 (OK)
    res.status(200).json({
      message: "Autor actualizado exitosamente",
      author
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al actualizar autor",
      details: error.message 
    });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    // Buscar el autor por ID
    const author = await AuthorModel.findById(req.params.id);
    
    // Si no se encuentra el autor, retornar 404
    if (!author) {
      return res.status(404).json({ 
        error: "Autor no encontrado" 
      });
    }
    
    // ELIMINACIÓN EN CASCADA
    
    // 1. Obtener todos los libros del autor
    const books = await BookModel.find({ author: req.params.id });
    const bookIds = books.map(book => book._id);
    
    // 2. Eliminar lógicamente todos los libros del autor (relación 1:N)
    await BookModel.updateMany(
      { author: req.params.id },
      { isAvailable: false }
    );
    
    // 3. Eliminar lógicamente todas las reseñas de esos libros (relación 1:N)
    if (bookIds.length > 0) {
      await ReviewModel.updateMany(
        { book: { $in: bookIds } },  // $in busca en el array de IDs
        { isActive: false }
      );
    }
    
    // 4. Eliminar lógicamente el autor
    author.isActive = false;
    await author.save();
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Autor eliminado exitosamente (eliminación en cascada aplicada)",
      author 
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al eliminar autor",
      details: error.message 
    });
  }
};
