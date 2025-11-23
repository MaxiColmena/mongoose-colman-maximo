import express from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser} from "../controllers/user.controllers.js";

const routerUser = express.Router();

routerUser.post("/users", createUser);
routerUser.get("/users", getAllUsers);  
routerUser.get("/users/:id", getUser);
routerUser.put("/users/:id", updateUser);
routerUser.delete("/users/:id", deleteUser);

export default routerUser;