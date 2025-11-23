import express from "express";
import { createAuthor, getAllAuthors, getAuthor, updateAuthor, deleteAuthor} from "../controllers/author.controllers.js";

const routerAuthor = express.Router();

routerAuthor.post("/authors", createAuthor);    
routerAuthor.get("/authors", getAllAuthors);      
routerAuthor.get("/authors/:id", getAuthor);       
routerAuthor.put("/authors/:id", updateAuthor);    
routerAuthor.delete("/authors/:id", deleteAuthor); 

export default routerAuthor;