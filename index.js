const express = require("express");
const dotenv = require("dotenv");
const pnrRoutes = require("./routes/pnrRoutes");
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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
