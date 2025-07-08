import { useState } from "react";

// Haversine formülü (km cinsinden)
function haversineDistance(coord1, coord2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findNearestBranches(customer, allBranches, count = 5) {
    if (!customer?.location || allBranches.length === 0) return [];

    const distances = allBranches.map((branch) => {
        const distance = haversineDistance(customer.location, branch.location);
        return { ...branch, distance };
    });

    return distances.sort((a, b) => a.distance - b.distance).slice(0, count);
}

function TransferForm({ customer, branches }) {
    const [promptText, setPromptText] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!promptText.trim()) {
            alert("Lütfen talebinizi giriniz.");
            return;
        }

        const nearest = findNearestBranches(customer, branches);
        console.log("🔍 En yakın 5 şube:", nearest);
        console.log("🧠 Müşteri mesajı:", promptText);
        console.log("📍 Müşteri konumu:", customer.location);

        setSubmitted(true);
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2>📨 Şube Değişiklik Talebi</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Lütfen talebinizi yazınız (almak istediğiniz hizmetleri belirtiniz):
                </label>
                <br />
                <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={5}
                    placeholder="Örn: Yatırım danışmanlığı ve dijital bankacılık desteği istiyorum..."
                    style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
                />
                <br />
                <button type="submit" style={{ marginTop: "1rem" }}>
                    Devam Et
                </button>
            </form>

            {submitted && (
                <div style={{ marginTop: "1rem", color: "green" }}>
                    ✅ Talebiniz alındı. Sistem en uygun şubeyi önerecek...
                </div>
            )}
        </div>
    );
}

export default TransferForm;
