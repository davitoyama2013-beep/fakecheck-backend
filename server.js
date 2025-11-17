import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("FakeCheck API está online ✔");
});

app.post("/check", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Texto está vazio." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um verificador de notícias. Analise apenas se o texto é verdadeiro ou falso, e explique por quê." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();

    // SE DER ERRO NA IA (MUUUITO COMUM COM API KEY ERRADA)
    if (!data.choices || !data.choices[0]) {
      console.error("Erro da OpenAI:", data);
      return res.json({
        result: "⚠️ Erro ao consultar a IA. Verifique sua OPENAI_API_KEY no Render."
      });
    }

    return res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Erro no servidor:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
