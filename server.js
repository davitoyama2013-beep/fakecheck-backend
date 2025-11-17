import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cria cliente da OpenAI (novo formato)
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// EndPoint principal
app.post("/verify", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Texto não enviado!" });
        }

        // Chamada correta usando client.chat.completions
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Você é um verificador de notícias falsas. Responda apenas se o texto parece real ou fake e explique o motivo."
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });

        const result = response.choices?.[0]?.message?.content || "Erro ao gerar resposta";

        res.json({ result });

    } catch (error) {
        console.error("Erro no backend:", error);

        res.status(500).json({
            error: "Erro interno no servidor.",
            details: error.message
        });
    }
});

// Render exige usar process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
