import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetBalance = () => {
  const [balance, setBalance] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bank/balance`,
          { withCredentials: true, timeout: 5000 }
        );
        setBalance(res.data.balance);
        setAccountNumber(res.data.accountNumber);
        setIban(res.data.iban);
      } catch (err) {
        console.error("Error fetching balance:", err);
        if (err.response?.status === 401) {
          setError("Du må være innlogget for å se saldo. Vennligst logg inn.");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setError(
            err.response?.data?.message ||
              "Feil ved henting av saldo. Prøv igjen senere."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Din kontoinformasjon</h2>

      {loading ? (
        <p>Laster...</p>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-lg mb-2">
            <strong>Saldo:</strong> {balance} kr
          </p>
          <p className="text-lg mb-2">
            <strong>Kontonummer:</strong> {accountNumber}
          </p>
          <p className="text-lg">
            <strong>IBAN:</strong> {iban}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
      >
        Tilbake til hovedmenyen
      </button>
    </div>
  );
};

export default GetBalance;
