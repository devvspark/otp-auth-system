import express from "express";
import authRoutes from "./routes/auth.routes.js";

import "./config/redis.js";// import redis from "./config/redis.js"; we are not importing like this becuase  we are not using its value  
// so once the app start it will execute once at top 
const app = express();

app.use(express.json());
// auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "OTP Authentication System API" });
});

export default app;