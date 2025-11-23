import express from "express";
import { createBook, getAllBooks, getBook, updateBook, deleteBook} from "../controllers/book.controllers.js";

const routerBook = express.Router();

routerBook.post("/books", createBook);    
routerBook.get("/books", getAllBooks);     
routerBook.get("/books/:id", getBook);        
routerBook.put("/books/:id", updateBook);    
routerBook.delete("/books/:id", deleteBook); 

export default routerBook;