import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";

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
    <div className="bg-white">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader size={24} className="animate-spin text-red-600" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg mb-2">
              <span className="font-medium text-gray-500">Saldo:</span>
              <span className="ml-2 text-xl font-bold text-red-600">
                {balance} kr
              </span>
            </div>
            <div className="text-md mb-2">
              <span className="font-medium text-gray-500">Kontonummer:</span>
              <span className="ml-2">{accountNumber}</span>
            </div>
            <div className="text-md">
              <span className="font-medium text-gray-500">IBAN:</span>
              <span className="ml-2">{iban}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
          >
            Tilbake til hovedmenyen
          </button>
        </div>
      )}
    </div>
  );
};

export default GetBalance;
