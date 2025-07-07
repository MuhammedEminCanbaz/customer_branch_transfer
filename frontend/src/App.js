import CustomerList from "./components/CustomerList";
import BranchList from "./components/BranchList";
import TransferForm from "./components/TransferForm";

function App() {
  return (
    <div>
      <h1>Müşteri Devir Uygulaması</h1>
      <TransferForm />
      <CustomerList />
      <BranchList />
    </div>
  );
}

export default App;
