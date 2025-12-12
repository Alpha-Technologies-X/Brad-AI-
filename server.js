import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Error.";

    res.json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
