import express from "express";
import { createReview, getAllReviews, getReview, updateReview, deleteReview} from "../controllers/reviewController.js";

const routerReview = express.Router();

routerReview.post("/review", createReview);       
routerReview.get("/review", getAllReviews);          
routerReview.get("/review/:id", getReview);        
routerReview.put("/review/:id", updateReview);     
routerReview.delete("/review/:id", deleteReview);  

export default router;