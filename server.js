const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "fonts")));

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


setInterval(() => {
    fetch("https://auto-complete-flrm.onrender.com/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "HDFC" })
    })
    .then(res => console.log("Keep-alive POST request sent"))
    .catch(err => console.error("Keep-alive failed:", err));
  }, 14 * 60 * 1000);   

  setInterval(() => {
    fetch("https://auto-complete-sell.onrender.com/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "HDFC" })
    })
    .then(res => console.log("Keep-alive POST request sent"))
    .catch(err => console.error("Keep-alive failed:", err));
  }, 14 * 60 * 1000);   

  

  setInterval(() => {
    fetch("https://portfolio-simulator-v1-0.onrender.com/app/v1/ping", {
      method: "GET"
    })
    .then(res => console.log("Ping backend GET request sent"))
    .catch(err => console.error("Ping backend failed:", err));
  }, 14 * 60 * 1000);
  