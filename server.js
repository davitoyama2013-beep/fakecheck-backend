import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/check", async (req, res) => {
  const { text } = req.body;

  const ai = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Analise se o texto é verdadeiro ou fake." },
        { role: "user", content: text }
      ]
    })
  });

  const data = await ai.json();

  res.json({ result: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
