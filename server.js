import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/check", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você analisa se um texto parece verdadeiro ou falso." },
        { role: "user", content: text }
      ]
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (err) {
    console.error("ERRO:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
