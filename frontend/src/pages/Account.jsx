import React from "react";
import Deposit from "../components/accountComponents/Deposit.jsx";
import Withdraw from "../components/accountComponents/Withdraw.jsx";
import Transfer from "../components/accountComponents/Transfer.jsx"; // Add this import
import GetBalance from "../components/accountComponents/GetBalance.jsx";
import TransactionHistory from "../components/accountComponents/TransactionHistory.jsx";

function Account() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4 text-red-600 border-b pb-2">
            Kontoinformasjon
          </h2>
          <GetBalance />
        </div>

        <div className="border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4 text-red-600 border-b pb-2">
            Innskudd
          </h2>
          <Deposit />
        </div>

        <div className="border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4 text-red-600 border-b pb-2">
            Uttak
          </h2>
          <Withdraw />
        </div>

        {/* Add this new component */}
        <div className="border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4 text-red-600 border-b pb-2">
            Overføring
          </h2>
          <Transfer />
        </div>

        <div className="border rounded-lg shadow-sm p-4 md:col-span-2">
          <h2 className="text-lg font-medium mb-4 text-red-600 border-b pb-2">
            Transaksjoner
          </h2>
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}

export default Account;
