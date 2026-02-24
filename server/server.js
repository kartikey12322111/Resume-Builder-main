import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";  // ✅ AI ROUTES IMPORT
import cors from "cors";

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// middleware
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);  // ✅ AI ROUTES USE

// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Routes registered:`);
  console.log(`   - /api/users`);
  console.log(`   - /api/resumes`);
  console.log(`   - /api/ai`);
});