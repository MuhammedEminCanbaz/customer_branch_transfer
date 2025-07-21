import { useEffect, useState } from "react";

function UserLogin({ onCustomerSelected }) {
    const [customers, setCustomers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [nationalId, setNationalId] = useState("");
    const [customerNumber, setCustomerNumber] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Müşteri ve şube verilerini al
    useEffect(() => {
        fetch("/api/customers")
            .then((res) => res.json())
            .then((data) => setCustomers(data));

        fetch("/api/branches")
            .then((res) => res.json())
            .then((data) => setBranches(data));
    }, []);

    const handleSearch = () => {
        const tc = nationalId.trim();
        const no = customerNumber.trim();

        if (!tc && !no) {
            alert("Lütfen TC Kimlik No veya Müşteri No giriniz.");
            return;
        }

        const found = customers.find(c =>
            (tc && c.nationalId === tc) ||
            (no && c.customerNumber === no)
        );

        if (found) {
            setSelectedCustomer(found);
            onCustomerSelected(found);
        } else {
            alert("Müşteri bulunamadı. Bilgileri kontrol ediniz.");
        }
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : "Şube bulunamadı";
    };

    return (
        <div>
            <h2>Müşteri Şube Sorgulama</h2>

            <label><strong>TC Kimlik No:</strong></label><br />
            <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="11 haneli"
            /><br /><br />

            <label><strong>Müşteri No:</strong></label><br />
            <input
                type="text"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                placeholder="8 haneli"
            /><br /><br />

            <button onClick={handleSearch}>Sorgula</button>

            {selectedCustomer && (
                <div className="info-box" style={{ marginTop: "1rem" }}>
                    <h3>📄 Güncel Bilgileriniz</h3>
                    <p><strong>Ad Soyad:</strong> {selectedCustomer.name}</p>
                    <p><strong>Bağlı Olduğunuz Şube:</strong> {getBranchName(selectedCustomer.branchId)}</p>
                </div>
            )}
        </div>
    );
}

export default UserLogin;
