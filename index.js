const express = require("express");
const dotenv = require("dotenv");
const pnrRoutes = require("./routes/pnrRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api", pnrRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send(" Vapi Railway PNR Backend is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
