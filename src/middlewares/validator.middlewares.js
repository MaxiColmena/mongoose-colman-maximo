import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  // Obtener los errores de validación de express-validator
  const errors = validationResult(req);
  
  // Si hay errores, retornar código 400 (Bad Request) con los detalles
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Error de validación",
      details: errors.array()
    });
  }
  
  // Si no hay errores, continuar al siguiente middleware
  next();
};

