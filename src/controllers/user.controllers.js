import User from "../models/User.js";

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios 
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID 
export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario 
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!user || !user.isActive) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminación lógica 
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(200).json({ message: "Usuario eliminado", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};