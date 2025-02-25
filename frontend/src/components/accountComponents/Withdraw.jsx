import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    try {
      setError("");
      setMessage("");

      if (!amount || amount <= 0) {
        setError("Vennligst oppgi et gyldig beløp");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bank/withdraw`,
        { amount },
        { withCredentials: true, timeout: 5000 }
      );
      console.log("Withdrawal successful:", res.data);
      setMessage(`Uttak vellykket! Ny saldo: ${res.data.newBalance} kr`);
      setAmount("");
    } catch (err) {
      console.error("Error withdrawing funds:", err);

      if (err.response?.status === 401) {
        setError(
          "Du må være innlogget for å ta ut penger. Vennligst logg inn."
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(
          err.response?.data?.message || "Feil ved uttak. Prøv igjen senere."
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ta ut penger fra kontoen</h2>

      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <input
        type="number"
        placeholder="Beløp"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleWithdraw}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
      >
        Ta ut
      </button>
      <button
        onClick={() => navigate("/")}
        className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
      >
        Tilbake til hovedmenyen
      </button>
    </div>
  );
};

export default Withdraw;
