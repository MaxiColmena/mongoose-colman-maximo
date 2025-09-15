import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// app.use("/api", routerUser);

app.listen(PORT, async () => {
    await connectDB();
    console.log("Servidor corriendo en el puerto: ", PORT);
}); 