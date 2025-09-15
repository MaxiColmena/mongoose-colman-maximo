import express from "express";
import { createAuthor, getAllAuthors, getAuthor, updateAuthor, deleteAuthor} from "../controllers/authorController.js";

const routerAuthor = express.Router();

routerAuthor.post("/author", createAuthor);    
routerAuthor.get("/author", getAllAuthors);      
routerAuthor.get("/author/:id", getAuthor);       
routerAuthor.put("/author/:id", updateAuthor);    
routerAuthor.delete("/author/:id", deleteAuthor); 

export default router;