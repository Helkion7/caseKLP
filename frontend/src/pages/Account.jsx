import React, { useState } from "react";
import Deposit from "../components/accountComponents/Deposit.jsx";
import Withdraw from "../components/accountComponents/Withdraw.jsx";
import GetBalance from "../components/accountComponents/GetBalance.jsx";
import TransactionHistory from "../components/accountComponents/TransactionHistory.jsx";

function Account() {
  const [activeTab, setActiveTab] = useState("balance");

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "balance"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("balance")}
          >
            Kontoinformasjon
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "deposit"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("deposit")}
          >
            Innskudd
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "withdraw"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            Uttak
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "transactions"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transaksjoner
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "balance" && <GetBalance />}
        {activeTab === "deposit" && <Deposit />}
        {activeTab === "withdraw" && <Withdraw />}
        {activeTab === "transactions" && <TransactionHistory />}
      </div>
    </div>
  );
}

export default Account;
