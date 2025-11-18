import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ AQUI ESTÁ A PARTE IMPORTANTE:
// Força o SDK a usar sua variável OPENAI_API_KEY do Render
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rota para teste
app.get("/", (req, res) => {
  res.send("API do FakeCheck funcionando! 🚀");
});

// Rota que seu frontend usa para enviar texto/imagem
app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analise o seguinte conteúdo: ${text}`
        }
      ]
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Erro na API:", error);
    res.status(500).json({ error: "Erro ao analisar o conteúdo." });
  }
});

// Porta obrigatória para o Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
