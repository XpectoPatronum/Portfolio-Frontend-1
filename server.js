const express = require("express");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "fonts")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(__dirname));
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "assets", "favicon.ico"));
  });

// Serve login.html as the default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Route for login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Route for index page (Dashboard)
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get('/api/config', (req, res) => {
    res.json({ JAVA_BACKEND_URL: process.env.JAVA_BACKEND_URL });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
  