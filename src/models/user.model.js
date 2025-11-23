import mongoose from "mongoose";
import { model } from "mongoose";

const userSchema = new mongoose.Schema({
  // Nombre del usuario
  name: {
    type: String,
    required: true
  },
  // Email único del usuario
  email: {
    type: String,
    required: true,
    unique: true  // Email único, no se puede repetir
  },
  // Contraseña del usuario
  password: {
    type: String,
    required: true,
  },
  // PROPIEDAD EMBEBIDA: Dirección del usuario
  // Se almacena directamente en el documento del usuario
  address: {
    street: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    },
    zipCode: {
      type: String,
      default: ""
    }
  },
  // Campo para eliminación lógica
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Crea automáticamente createdAt y updatedAt
});

export const UserModel = model("User", userSchema);