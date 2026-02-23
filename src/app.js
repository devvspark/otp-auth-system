import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "OTP Authentication System API" });
});

export default app;