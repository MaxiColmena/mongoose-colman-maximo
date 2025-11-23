import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";

export const createProfile = async (req, res) => {
  try {
    // Verificar que el usuario existe y está activo
    const user = await UserModel.findOne({ 
      _id: req.body.user, 
      isActive: true 
    });
    
    // Si no se encuentra el usuario, retornar 404
    if (!user) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }
    
    // Verificar que el usuario no tenga ya un perfil
    const existingProfile = await ProfileModel.findOne({ 
      user: req.body.user,
      isActive: true 
    });
    
    if (existingProfile) {
      return res.status(400).json({ 
        error: "El usuario ya tiene un perfil activo" 
      });
    }
    
    // Crear nueva instancia del modelo Profile con los datos del body
    const profile = new ProfileModel(req.body);
    // Guardar el perfil en la base de datos
    await profile.save();
    
    // POPULATE: Traer datos completos del usuario relacionado
    await profile.populate("user", "name email");
    
    // Retornar el perfil creado con código 201 (Created)
    res.status(201).json({
      message: "Perfil creado exitosamente",
      profile
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al crear perfil",
      details: error.message 
    });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    // Buscar todos los perfiles activos con populate del usuario
    const profiles = await ProfileModel.find({ isActive: true })
      .populate("user", "name email");  // Trae datos básicos del usuario
    
    // Retornar la lista de perfiles con código 200 (OK)
    res.status(200).json({
      message: "Perfiles obtenidos exitosamente",
      count: profiles.length,
      profiles
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener perfiles",
      details: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Buscar perfil por ID que esté activo
    const profile = await ProfileModel.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate("user", "name email address");  // Trae datos del usuario incluyendo dirección embebida
    
    // Si no se encuentra el perfil, retornar 404 (Not Found)
    if (!profile) {
      return res.status(404).json({ 
        error: "Perfil no encontrado" 
      });
    }
    
    // Retornar el perfil encontrado con código 200 (OK)
    res.status(200).json({
      message: "Perfil obtenido exitosamente",
      profile
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener perfil",
      details: error.message 
    });
  }
};

export const getProfileByUserId = async (req, res) => {
  try {
    // Buscar perfil por ID de usuario que esté activo
    const profile = await ProfileModel.findOne({ 
      user: req.params.userId, 
      isActive: true 
    })
      .populate("user", "name email address");  // Trae datos del usuario incluyendo dirección embebida
    
    // Si no se encuentra el perfil, retornar 404 (Not Found)
    if (!profile) {
      return res.status(404).json({ 
        error: "Perfil no encontrado para este usuario" 
      });
    }
    
    // Retornar el perfil encontrado con código 200 (OK)
    res.status(200).json({
      message: "Perfil obtenido exitosamente",
      profile
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al obtener perfil",
      details: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Buscar y actualizar el perfil por ID
    // new: true retorna el documento actualizado
    const profile = await ProfileModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }  // runValidators ejecuta las validaciones del schema
    )
      .populate("user", "name email");
    
    // Si no se encuentra el perfil o no está activo, retornar 404
    if (!profile || !profile.isActive) {
      return res.status(404).json({ 
        error: "Perfil no encontrado" 
      });
    }
    
    // Retornar el perfil actualizado con código 200 (OK)
    res.status(200).json({
      message: "Perfil actualizado exitosamente",
      profile
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al actualizar perfil",
      details: error.message 
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    // Buscar el perfil por ID
    const profile = await ProfileModel.findById(req.params.id);
    
    // Si no se encuentra el perfil, retornar 404
    if (!profile) {
      return res.status(404).json({ 
        error: "Perfil no encontrado" 
      });
    }
    
    // Eliminar lógicamente el perfil (marcar isActive como false)
    profile.isActive = false;
    await profile.save();
    
    // Retornar mensaje de éxito con código 200 (OK)
    res.status(200).json({ 
      message: "Perfil eliminado exitosamente",
      profile 
    });
  } catch (error) {
    // Manejo de errores: retornar código 500 (Internal Server Error)
    res.status(500).json({ 
      error: "Error al eliminar perfil",
      details: error.message 
    });
  }
};

