// src/components/CustomerList.js

import { useEffect, useState } from "react";

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/api/customers")
            .then((res) => res.json())
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Veri alınamadı:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div>
            <h2>Müşteri Listesi</h2>
            <ul>
                {customers.map((customer) => (
                    <li key={customer.id}>
                        {customer.name} - {customer.district}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerList;
