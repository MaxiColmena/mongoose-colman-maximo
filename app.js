import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
import userRoutes from "./src/routes/user.routes.js";
import authorRoutes from "./src/routes/author.routes.js"
import bookRoutes from "./src/routes/book.routes.js"
import reviewRoutes from "./src/routes/review.routes.js";
import profileRoutes from "./src/routes/profile.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); 
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", authorRoutes);
app.use("/api", bookRoutes);
app.use("/api", reviewRoutes);
app.use("/api", profileRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log("Servidor corriendo en el puerto: ", PORT);
});