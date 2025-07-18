import { useState } from "react";
import services from "../data/services.json";

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

function findNearestBranches(customer, branches, count = 5) {
    if (!customer?.location) return [];
    return branches
        .filter((b) => b.id !== customer.branchId)
        .map((b) => ({
            ...b,
            distance: haversineDistance(customer.location, b.location),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count);
}

function TransferForm({ customer, branches }) {
    const [showModal, setShowModal] = useState(false);
    const [answers, setAnswers] = useState({});
    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnswerChange = (serviceId, value) => {
        setAnswers({ ...answers, [serviceId]: value });
    };

    const handleSubmitSurvey = async () => {
        const selected = Object.entries(answers)
            .filter(([_, value]) => value === "evet")
            .map(([id]) => services.find((s) => s.id === id)?.name)
            .filter(Boolean);

        if (selected.length === 0) {
            alert("Lütfen en az bir hizmet seçiniz.");
            return;
        }

        const message = `Müşteri şu hizmetleri almak istiyor: ${selected.join(", ")}`;
        const nearest = findNearestBranches(customer, branches);

        setLoading(true);
        try {
            const res = await fetch("/api/llm/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerMessage: message,
                    nearestBranches: nearest,
                    needsDisabilitySupport: customer.needsDisabilitySupport
                })
            });

            const text = await res.text();
            const data = JSON.parse(text);

            if (data.suggestion) setSuggestion(data.suggestion);
            else setSuggestion("Öneri alınamadı.");
        } catch (err) {
            console.error("LLM Hatası:", err);
            setSuggestion("Bir hata oluştu.");
        }

        setLoading(false);
        setShowModal(false);
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2>📨 Şube Devir İşlemi Yapmak İçin Anketi Doldurun</h2>

            <button
                onClick={() => setShowModal(true)}
                style={{
                    backgroundColor: "#b30000",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Ankete Git
            </button>

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "2rem",
                        width: "90%",
                        maxWidth: "600px",
                        boxShadow: "0 0 12px rgba(0,0,0,0.2)"
                    }}>
                        <h3>📝 Hizmet Anketi</h3>
                        <p>Almak istediğiniz hizmetleri belirtiniz:</p>

                        {services.map((service) => (
                            <div key={service.id} style={{ marginBottom: "1rem" }}>
                                <label>{`${service.name} hizmeti sizin için önemli mi?`}</label>
                                <select
                                    value={answers[service.id] || ""}
                                    onChange={(e) => handleAnswerChange(service.id, e.target.value)}
                                    style={{ display: "block", marginTop: "0.5rem", padding: "0.3rem", width: "100%" }}
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="evet">Evet</option>
                                    <option value="hayir">Hayır</option>
                                </select>
                            </div>
                        ))}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button
                                onClick={handleSubmitSurvey}
                                style={{
                                    backgroundColor: "#b30000",
                                    color: "#fff",
                                    padding: "0.5rem 1rem",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Devam Et
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    backgroundColor: "#ccc",
                                    color: "#000",
                                    padding: "0.5rem 1rem",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <p>⏳ Öneri getiriliyor...</p>}

            {suggestion && (
                <div style={{
                    marginTop: "1rem",
                    backgroundColor: "#fff2f2",
                    border: "1px solid #ffcccc",
                    padding: "1rem",
                    borderRadius: "6px"
                }}>
                    <h3>🤖 Yapay Zeka Önerisi</h3>
                    <p><strong>LLM cevabı:</strong> {suggestion}</p>
                </div>
            )}
        </div>
    );
}

export default TransferForm;
