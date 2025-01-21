const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Endpoint
app.post("/improve", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text input is required" });
  }

  try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",  // Use gpt-3.5-turbo instead of gpt-4
        messages: [
          { role: "system", content: "You are a professional CV improvement assistant." },
          { role: "user", content: `Improve the following text:\n${text}` },
        ],
      });

    const improvedText = response.choices[0].message.content;
    res.json({ improvedText });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
