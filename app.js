import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
import userRoutes from "./src/routes/user.routes.js";
import authorRoutes from "./src/routes/author.routes.js"
import bookRoutes from "./src/routes/book.routes.js"
import reviewRoutes from "./src/routes/review.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); 
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log("Servidor corriendo en el puerto: ", PORT);
});