// src/components/TransferForm.js

import { useState } from "react";

function TransferForm() {
    const [prompt, setPrompt] = useState("");
    const [suggestedBranch, setSuggestedBranch] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simülasyon: Gerçek LLM yerine örnek cevap
        setTimeout(() => {
            const fakeBranch = {
                id: "S008",
                name: "Maltepe Şubesi",
                reason: "Bu şube dijital bankacılık ve yatırım danışmanlığı hizmetlerini sağlıyor."
            };
            setSuggestedBranch(fakeBranch);
            setLoading(false);
        }, 1500);
    };

    return (
        <div>
            <h2>Müşteri Şube Değişiklik Talebi</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="İsteklerinizi buraya yazınız..."
                    rows={4}
                    style={{ width: "100%", padding: "0.5rem" }}
                />
                <button type="submit" style={{ marginTop: "1rem" }}>
                    Şube Öner
                </button>
            </form>

            {loading && <p>Öneri getiriliyor...</p>}

            {suggestedBranch && (
                <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
                    <h3>Önerilen Şube</h3>
                    <p><strong>{suggestedBranch.name}</strong> (ID: {suggestedBranch.id})</p>
                    <p>{suggestedBranch.reason}</p>
                </div>
            )}
        </div>
    );
}

export default TransferForm;
