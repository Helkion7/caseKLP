import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDeposit = async () => {
    try {
      setError("");
      setMessage("");

      if (!amount || amount <= 0) {
        setError("Vennligst oppgi et gyldig beløp");
        return;
      }

      // The userId is retrieved from the JWT token on the server
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bank/deposit`,
        { amount },
        { withCredentials: true, timeout: 5000 }
      );
      console.log("Deposit successful:", res.data);
      setMessage(`Innskudd vellykket! Ny saldo: ${res.data.newBalance} kr`);
      setAmount("");
    } catch (err) {
      console.error("Error depositing funds:", err);

      // Handle different error responses
      if (err.response?.status === 401) {
        setError(
          "Du må være innlogget for å sette inn penger. Vennligst logg inn."
        );
        // Optional: Redirect to login page after a delay
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(
          err.response?.data?.message || "Feil ved innskudd. Prøv igjen senere."
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sett inn penger på kontoen</h2>

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
        onClick={handleDeposit}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
      >
        Sett inn
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

export default Deposit;
