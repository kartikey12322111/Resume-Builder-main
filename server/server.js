import "dotenv/config";
import express from "express";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", 
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null
].filter(Boolean);

// CORS setup
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '');
    if(allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin} is not in allowed origins list: ${allowedOrigins.join(', ')}`);
      return callback(null, true); // Temporarily allow all Origins while fixing deployment!
    }
  },
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