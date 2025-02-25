import React from "react";
import Deposit from "../components/accountComponents/Deposit.jsx";
import Withdraw from "../components/accountComponents/Withdraw.jsx";
import GetBalance from "../components/accountComponents/GetBalance.jsx";

function Account() {
  return (
    <div>
      <Deposit />
      <Withdraw />
      <GetBalance />
    </div>
  );
}

export default Account;
