import express from "express";
import { 
  createProfile, 
  getAllProfiles, 
  getProfile, 
  getProfileByUserId,
  updateProfile, 
  deleteProfile 
} from "../controllers/profile.controllers.js";

const routerProfile = express.Router();

routerProfile.post(
  "/profiles",
  createProfile
);

routerProfile.get("/profiles", getAllProfiles);

routerProfile.get(
  "/profiles/:id",
  getProfile
);

routerProfile.get(
  "/profiles/user/:userId",
  getProfileByUserId
);

routerProfile.put(
  "/profiles/:id",
  updateProfile
);

routerProfile.delete(
  "/profiles/:id",
  deleteProfile
);

export default routerProfile;

