const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so frontend can access backend
app.use(cors());

// Test route
app.get("/api/test", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
