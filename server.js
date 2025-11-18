import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste (Render usa)
app.get("/", (req, res) => {
  res.send("Backend FakeCheck está rodando! 🚀");
});

// Rota principal
app.post("/check", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto não enviado." });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um detector de fake news." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await openaiResponse.json();

    res.json({
      result: data.choices?.[0]?.message?.content || "Sem resposta da IA."
    });

  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Porta do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
