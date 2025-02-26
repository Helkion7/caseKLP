import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

const BankRegister = () => {
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate bank account number (Norwegian standard: 11 digits)
    if (!/^\d{11}$/.test(bankAccountNumber)) {
      setError("Kontonummer må være 11 siffer");
      return;
    }

    // Store in session storage to pass to the next page
    sessionStorage.setItem("pendingBankAccount", bankAccountNumber);

    // Navigate to the registration page
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <h1 className="text-gray-800 text-4xl mb-4">Registrer Bankkonto</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Skriv inn ditt kontonummer for å starte registreringen. Dette vil bli
        koblet til din nye konto.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="relative">
          <CreditCard
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Kontonummer (11 siffer)"
            value={bankAccountNumber}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, "");
              setBankAccountNumber(value);
              setError("");
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-red-600"
            maxLength={11}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Fortsett til Registrering
        </button>
      </form>

      <button
        onClick={() => navigate("/login")}
        className="mt-4 text-red-600 hover:underline"
      >
        Har allerede en konto? Logg Inn
      </button>
    </div>
  );
};

export default BankRegister;
