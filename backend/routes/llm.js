const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post("/recommend", async (req, res) => {
    const { customerMessage, nearestBranches, needsDisabilitySupport } = req.body;

    if (!customerMessage || !nearestBranches) {
        return res.status(400).json({ error: "Eksik veri gönderildi." });
    }

    const prompt = `
Bu isteklerimi dikkate almanı ve yeni şube önermeni istiyorum.
"${customerMessage}"

Engelli desteği ihtiyacı: ${needsDisabilitySupport ? "VAR" : "YOK"}

Sana vereceğim bu şubeler arasından seçim yap.

${nearestBranches.map((b, i) =>
        `${i + 1}. ${b.name} | Hizmetler: ${b.services.join(", ")} | Engelli Birimi: ${b.hasDisabilityUnit ? "Var" : "Yok"}`
    ).join("\n")}

sadece en uygun şubenin adını (örneğin: "Kadıköy Şubesi") ve neden bu seçimi yaptığını söyle. Teknik terim kullanma.
`;

    try {
        const response = await axios.post(
            GEMINI_URL,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error("Gemini yanıtı alınamadı:", response.data);
            return res.status(500).json({ error: "Yanıt alınamadı." });
        }

        res.json({ suggestion: reply.trim() });

    } catch (err) {
        console.error("Gemini API hatası:", err.message);
        if (err.response) {
            console.error("Detay:", err.response.data);
        }
        res.status(500).json({ error: "Gemini API çağrısı başarısız." });
    }
});

module.exports = router;
