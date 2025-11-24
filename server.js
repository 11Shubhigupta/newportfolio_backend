const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Existing routes
const projects = require("./data/projects");
const certifications = require("./data/certifications");

app.get("/", (req, res) => res.send("Portfolio API running"));

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/certifications", (req, res) => {
  res.json(certifications);
});

// ⭐ CHATBOT ROUTE (Groq backend)
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: req.body.messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
 
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "AI Request Failed" });
  }
});

module.exports = app;

