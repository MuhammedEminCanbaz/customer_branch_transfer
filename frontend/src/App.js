import { useState, useEffect } from "react";
import UserLogin from "./components/UserLogin";
import CustomerList from "./components/CustomerList";
import BranchList from "./components/BranchList";
import TransferForm from "./components/TransferForm";
import "./app.css"

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  return (
    <>
      <div className="app-header">Müşteri Devir Uygulaması</div>
      <div className="app-container">


        <UserLogin onCustomerSelected={setSelectedCustomer} />

        {selectedCustomer && (
          <>
            <TransferForm customer={selectedCustomer} branches={branches} />
            <BranchList />
          </>
        )}
      </div>
    </>
  );
}

export default App;
