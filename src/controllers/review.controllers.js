import { ReviewModel } from "../models/review.model.js";

export const createReview = async (req, res) => {
  try {
    // Crear nueva instancia del modelo Review con los datos del body
    const review = new ReviewModel(req.body);
    // Guardar la reseña en la base de datos
    await review.save();
    
    // POPULATE: Traer datos completos de las relaciones
    // Como Review no tiene referencias directas en otras colecciones,
    // usamos populate desde Review hacia User y Book
    await review.populate("user", "name email");  // Trae datos básicos del usuario
    await review.populate("book", "title isbn");  // Trae datos básicos del libro
    
    // Retornar la reseña creada con código 201 (Created)
    res.status(201).json({
      message: "Reseña creada exitosamente",
      review
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al crear reseña",
      details: error.message 
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    // Buscar todas las reseñas activas
    // POPULATE: Trae los datos completos de las relaciones
    const reviews = await ReviewModel.find({ isActive: true })
      .populate("user", "name email")   // Trae datos básicos del usuario
      .populate("book", "title isbn author")  // Trae datos del libro y su autor
      .populate({
        path: "book",
        populate: {
          path: "author",  // Anidado: trae el autor del libro
          select: "name nationality"
        }
      });
    
    // Retornar la lista de reseñas con código 200 (OK)
    res.status(200).json({
      message: "Reseñas obtenidas exitosamente",
      count: reviews.length,
      reviews
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener reseñas",
      details: error.message 
    });
  }
};

export const getReview = async (req, res) => {
  try {
    // Buscar reseña por ID que esté activa
    // POPULATE: Trae los datos completos de las relaciones
    const review = await ReviewModel.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate("user", "name email")   // Trae datos básicos del usuario
      .populate("book", "title isbn author")  // Trae datos del libro
      .populate({
        path: "book",
        populate: {
          path: "author",  // Anidado: trae el autor del libro
          select: "name nationality"
        }
      });
    
    // Si no se encuentra la reseña, retornar 404 (Not Found)
    if (!review) {
      return res.status(404).json({ 
        error: "Reseña no encontrada" 
      });
    }
    
    // Retornar la reseña encontrada con código 200 (OK)
    res.status(200).json({
      message: "Reseña obtenida exitosamente",
      review
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener reseña",
      details: error.message 
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    // Buscar y actualizar la reseña por ID
    // new: true retorna el documento actualizado
    const review = await ReviewModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }  // runValidators ejecuta las validaciones del schema
    )
      .populate("user", "name email")   // Trae datos básicos del usuario
      .populate("book", "title isbn");  // Trae datos básicos del libro
    
    // Si no se encuentra la reseña o no está activa, retornar 404
    if (!review || !review.isActive) {
      return res.status(404).json({ 
        error: "Reseña no encontrada" 
      });
    }
    
    // Retornar la reseña actualizada con código 200 (OK)
    res.status(200).json({
      message: "Reseña actualizada exitosamente",
      review
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al actualizar reseña",
      details: error.message 
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    // Buscar la reseña por ID
    const review = await ReviewModel.findById(req.params.id);
    
    // Si no se encuentra la reseña, retornar 404
    if (!review) {
      return res.status(404).json({ 
        error: "Reseña no encontrada" 
      });
    }
    
    // Eliminar lógicamente la reseña (marcar isActive como false)
    review.isActive = false;
    await review.save();
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Reseña eliminada exitosamente",
      review 
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al eliminar reseña",
      details: error.message 
    });
  }
};
