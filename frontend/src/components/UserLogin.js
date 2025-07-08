import { useEffect, useState } from "react";

function UserLogin({ onCustomerSelected }) {
    const [customers, setCustomers] = useState([]);
    const [inputName, setInputName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [branches, setBranches] = useState([]);

    // Müşteri ve şube verilerini al
    useEffect(() => {
        fetch("/api/customers")
            .then((res) => res.json())
            .then((data) => {
                console.log("Gelen müşteri verisi:", data);
                setCustomers(data);
            });

        fetch("/api/branches")
            .then((res) => res.json())
            .then((data) => {
                console.log("Gelen şube verisi:", data);
                setBranches(data);
            });
    }, []);

    const handleSearch = () => {
        const cleanInput = inputName.trim().toLowerCase();

        if (!cleanInput) {
            alert("Lütfen adınızı giriniz.");
            return;
        }

        const match = customers.find(
            (c) => c.name && c.name.trim().toLowerCase() === cleanInput
        );

        if (match) {
            setSelectedCustomer(match);
            onCustomerSelected(match);
        } else {
            alert("Müşteri bulunamadı. Lütfen adınızı doğru ve eksiksiz giriniz.");
        }
    };

    // Şube ismini müşteri branchId'si ile eşleştir
    const getBranchName = (branchId) => {
        if (!branchId) return "Şube ID yok";

        // Hem branchId hem de b.id değerlerini trimleyip küçük harfe çevirerek karşılaştırın
        const matchedBranch = branches.find(
            (b) => b.id && b.id.trim().toLowerCase() === branchId.trim().toLowerCase()
        );

        if (!matchedBranch) {
            console.warn("Eşleşmeyen şube ID:", branchId);
        }

        return matchedBranch ? matchedBranch.name : "Şube bulunamadı";
    };

    return (
        <div>
            <h2>Müşteri Devir Ekranına Hoşgeldiniz</h2>
            <label>İsim ve Soyisminizi girin:</label>
            <br />
            <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Örn: Ayşe Yıldız"
            />
            <button onClick={handleSearch} style={{ marginLeft: "1rem" }}>
                Doğrula
            </button>

            {selectedCustomer && (
                <div className="info-box">
                    <h3>📄 Güncel Bilgileriniz</h3>
                    <p><strong>Ad Soyad:</strong> {selectedCustomer.name}</p>
                    <p><strong>Bağlı Olduğunuz Şube:</strong> {getBranchName(selectedCustomer.branchId)}</p>
                </div>
            )}
        </div>
    );
}

export default UserLogin;