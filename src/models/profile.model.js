import mongoose from "mongoose";
import { model } from "mongoose";

const profileSchema = new mongoose.Schema({
  // RELACIÓN 1:1 - Referencia única a User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  // Un perfil solo puede pertenecer a un usuario
  },
  // Información adicional del perfil
  bio: {
    type: String,
    default: ""
  },
  // Fecha de nacimiento
  birthDate: {
    type: Date
  },
  // Intereses del usuario
  interests: [{
    type: String
  }],
  // Campo para eliminación lógica
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Crea automáticamente createdAt y updatedAt
});

export const ProfileModel = model("Profile", profileSchema);

