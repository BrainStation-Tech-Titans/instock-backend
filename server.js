import express from "express";
import cors from "cors";
import "dotenv/config";
import warehouses from "./routes/warehouses.js";
import inventory from "./routes/inventory.js";


const app = express();
const port = process.env.PORT || process.argv[2] || 8080;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Handle favicon requests (avoids unnecessary errors in logs)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});


app.use((req, res, next) => {
  console.log(`Request Method: ${req.method} | Request URL: ${req.url}`);
  next();
});


app.use("/api/warehouses", warehouses);

app.use("/api/inventories", inventory);


// 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at ${process.env.BACKEND_URL || "http://localhost:"}${port}`);
});
