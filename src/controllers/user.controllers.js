import { UserModel } from "../models/user.model.js";
import { ReviewModel } from "../models/review.model.js";
import { BookModel } from "../models/book.model.js";
import { ProfileModel } from "../models/profile.model.js";

export const createUser = async (req, res) => {
  try {
    // Crear nueva instancia del modelo User con los datos del body
    const user = new UserModel(req.body);
    // Guardar el usuario en la base de datos
    await user.save();
    // Retornar el usuario creado con código 201 (Created)
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al crear usuario",
      details: error.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios con isActive = true
    const users = await UserModel.find({ isActive: true });
    // Retornar la lista de usuarios con código 200 (OK)
    res.status(200).json({
      message: "Usuarios obtenidos exitosamente",
      count: users.length,
      users
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener usuarios",
      details: error.message 
    });
  }
};

export const getUser = async (req, res) => {
  try {
    // Buscar usuario por ID que esté activo
    const user = await UserModel.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    // Si no se encuentra el usuario, retornar 404 (Not Found)
    if (!user) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }
    
    // Retornar el usuario encontrado con código 200 (OK)
    res.status(200).json({
      message: "Usuario obtenido exitosamente",
      user
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener usuario",
      details: error.message 
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Buscar y actualizar el usuario por ID
    // new: true retorna el documento actualizado
    const user = await UserModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }  // runValidators ejecuta las validaciones del schema
    );
    
    // Si no se encuentra el usuario o no está activo, retornar 404
    if (!user || !user.isActive) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }
    
    // Retornar el usuario actualizado con código 200 (OK)
    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al actualizar usuario",
      details: error.message 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Buscar el usuario por ID
    const user = await UserModel.findById(req.params.id);
    
    // Si no se encuentra el usuario, retornar 404
    if (!user) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }
    
    // ELIMINACIÓN EN CASCADA
    
    // 1. Eliminar lógicamente el perfil del usuario (relación 1:1)
    await ProfileModel.updateOne(
      { user: req.params.id },
      { isActive: false }
    );
    
    // 2. Eliminar lógicamente todas las reseñas del usuario (relación 1:N)
    await ReviewModel.updateMany(
      { user: req.params.id },
      { isActive: false }
    );
    
    // 3. Remover el usuario de los favoritos de todos los libros (relación N:M)
    await BookModel.updateMany(
      { favoritedBy: req.params.id },
      { $pull: { favoritedBy: req.params.id } }  // $pull remueve el elemento del array
    );
    
    // 4. Eliminar lógicamente el usuario
    user.isActive = false;
    await user.save();
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Usuario eliminado exitosamente (eliminación en cascada aplicada)",
      user 
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al eliminar usuario",
      details: error.message 
    });
  }
};
