const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Connects to free tier db cluster on MongoDB Atlas
connectDB();

// Use routes
app.use("/", require("./routes/email"));

// Set server to listen on port
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
