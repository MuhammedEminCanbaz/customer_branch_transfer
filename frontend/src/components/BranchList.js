// src/components/BranchList.js

import { useEffect, useState } from "react";

function BranchList() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/branches")
            .then((res) => res.json())
            .then((data) => {
                setBranches(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Şube verisi alınamadı:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Şubeler yükleniyor...</p>;

    return (
        <div>
            <h2>Şube Listesi</h2>
            <ul>
                {branches.map((branch) => (
                    <li key={branch.id}>
                        <strong>{branch.name}</strong> - {branch.district} ({branch.services.length} hizmet)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BranchList;
