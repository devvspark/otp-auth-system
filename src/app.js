import express from "express";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(express.json());
// auth routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "OTP Authentication System API" });
});

export default app;