import express from "express";
import { createBook, getAllBooks, getBook, updateBook, deleteBook} from "../controllers/bookController.js";

const routerBook = express.Router();

routerBook.post("/book", createBook);    
routerBook.get("/book", getAllBooks);     
routerBook.get("/book/:id", getBook);        
routerBook.put("/book/:id", updateBook);    
routerBook.delete("/book/:id", deleteBook); 

export default router;