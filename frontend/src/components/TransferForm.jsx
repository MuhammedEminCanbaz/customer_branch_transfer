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

function findNearestBranches(customer, allBranches, count = 5) {
    if (!customer?.location || allBranches.length === 0) return [];

    const distances = allBranches
        .filter((branch) => branch.id !== customer.branchId)
        .map((branch) => ({
            ...branch,
            distance: haversineDistance(customer.location, branch.location),
        }));

    return distances.sort((a, b) => a.distance - b.distance).slice(0, count);
}

function TransferForm({ customer, branches }) {
    const [showSurvey, setShowSurvey] = useState(false);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const [showResult, setShowResult] = useState(false);

    const handleAnswerChange = (serviceId, value) => {
        setAnswers((prev) => ({ ...prev, [serviceId]: value }));
    };

    const handleSubmitSurvey = async () => {
        const selected = Object.entries(answers)
            .filter(([_, val]) => val === "evet")
            .map(([id]) => services.find((s) => s.id === id)?.name)
            .filter(Boolean);

        if (selected.length === 0) {
            alert("Lütfen en az bir hizmet seçiniz.");
            return;
        }

        const customerMessage = `Müşteri şu hizmetleri almak istiyor: ${selected.join(", ")}`;
        const nearest = findNearestBranches(customer, branches);

        setLoading(true);
        setShowSurvey(false);
        try {
            const res = await fetch("/api/llm/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerMessage,
                    nearestBranches: nearest,
                    needsDisabilitySupport: customer.needsDisabilitySupport,
                }),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("JSON parse hatası:", text);
                throw new Error("Sunucu geçersiz veri döndürdü.");
            }

            if (data.suggestion) {
                setSuggestion(data.suggestion);
                setShowResult(true);
            } else {
                setSuggestion("Öneri alınamadı.");
            }
        } catch (err) {
            console.error("LLM bağlantı hatası:", err);
            setSuggestion("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        const matchedBranch = branches.find((b) => suggestion.includes(b.name));
        if (!matchedBranch) {
            alert("Şube bilgisi yorumdan anlaşılamadı.");
            return;
        }

        try {
            const res = await fetch(`/api/customers/${customer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ branchId: matchedBranch.id }),
            });

            if (!res.ok) throw new Error("Sunucu hatası");
            alert("✅ Devir işlemi başarıyla tamamlandı.");
            setSuggestion("");
            setShowResult(false);
        } catch (err) {
            console.error("Devir hatası:", err);
            alert("Bir hata oluştu.");
        }
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2>📨 Şube Devir İşlemi İçin Anket</h2>

            {!showSurvey && !loading && !showResult && (
                <button
                    onClick={() => setShowSurvey(true)}
                    style={{
                        background: "crimson",
                        color: "white",
                        padding: "0.6rem 1rem",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Ankete Başla
                </button>
            )}

            {/* Anket Modal */}
            {showSurvey && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 999
                }}>
                    <div style={{
                        background: "white",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        <h3>📝 Hizmet Anketi</h3>
                        <p>Size aşağıdaki hizmetlerden hangileri önemli? Lütfen işaretleyin.</p>
                        {services.map((service) => (
                            <div key={service.id} style={{ marginBottom: "1rem" }}>
                                <label style={{ fontWeight: "bold" }}>{service.name}</label><br />
                                <select
                                    value={answers[service.id] || ""}
                                    onChange={(e) => handleAnswerChange(service.id, e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc"
                                    }}
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="evet">Evet</option>
                                    <option value="hayir">Hayır</option>
                                </select>
                            </div>
                        ))}
                        <button
                            onClick={handleSubmitSurvey}
                            style={{
                                marginTop: "1rem",
                                background: "#2d6cdf",
                                color: "white",
                                padding: "0.6rem 1rem",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            Gönder
                        </button>
                    </div>
                </div>
            )}

            {/* Yükleniyor göstergesi */}
            {loading && (
                <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                    ⏳ Öneri getiriliyor...
                </p>
            )}

            {/* LLM Sonuç Modali */}
            {showResult && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 999
                }}>
                    <div style={{
                        background: "white",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "500px"
                    }}>
                        <h3>🤖 Yapay Zeka Önerisi</h3>
                        <p><strong>Önerilen Şube:</strong> {suggestion}</p>
                        <p>Bu şubeye devir işlemi yapılsın mı?</p>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                            <button
                                onClick={handleTransfer}
                                style={{
                                    background: "green",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1.2rem",
                                    borderRadius: "8px"
                                }}
                            >
                                Evet, Devret
                            </button>

                            <button
                                onClick={() => {
                                    setShowResult(false);
                                    setSuggestion("");
                                }}
                                style={{
                                    background: "crimson",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1.2rem",
                                    borderRadius: "8px"
                                }}
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransferForm;
