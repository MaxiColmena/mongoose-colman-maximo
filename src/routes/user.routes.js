import express from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser} from "../controllers/user.controllers.js";

const routerUser = express.Router();

routerUser.post("/user", createUser);
routerUser.get("/user", getAllUsers);  
routerUser.get("/user/:id", getUser);
routerUser.put("/user/:id", updateUser);
routerUser.delete("/user/:id", deleteUser);

export default routerUser;