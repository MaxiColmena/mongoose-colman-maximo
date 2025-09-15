import Review from "../models/review.model.js";

// Crear reseña
export const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    
    // POPULATE para traer datos relacionados
    await review.populate("user book");
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las reseñas
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .populate("user")   // Trae datos del usuario
      .populate("book");  // Trae datos del libro
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una reseña por ID
export const getReview = async (req, res) => {
  try {
    const review = await Review.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate("user")
      .populate("book");
    
    if (!review) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar reseña
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
      .populate("user")
      .populate("book");
    
    if (!review || !review.isActive) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminación lógica
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    
    res.status(200).json({ message: "Reseña eliminada", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};