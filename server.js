import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o cliente OpenAI com a sua chave armazenada no Render
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rota inicial
app.get("/", (req, res) => {
  res.send("Backend FakeCheck rodando! 🚀");
});

// Rota de verificação
app.post("/check", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Texto ausente na requisição." });
    }

    // Chamada correta para o modelo mais recente
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Você é um verificador de fatos. Responda claramente:
      
      Frase: "${text}"
      
      Isso é verdadeiro, falso ou impossível verificar? Explique.`    
    });

    const resposta = completion.output_text || "Erro ao gerar resposta.";

    res.json({ result: resposta });

  } catch (error) {
    console.error("Erro completo:", error);
    res.status(500).json({ error: "Erro ao consultar a OpenAI." });
  }
});

// Porta dinâmica para Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
