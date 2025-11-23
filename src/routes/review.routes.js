import express from "express";
import { createReview, getAllReviews, getReview, updateReview, deleteReview} from "../controllers/review.controllers.js";

const routerReview = express.Router();

routerReview.post("/reviews", createReview);       
routerReview.get("/reviews", getAllReviews);          
routerReview.get("/reviews/:id", getReview);        
routerReview.put("/reviews/:id", updateReview);     
routerReview.delete("/reviews/:id", deleteReview);  

export default routerReview;