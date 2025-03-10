import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, CheckCircle, XCircle, Loader } from "lucide-react";

/**
 * Deposit Component
 *
 * Allows users to deposit funds to their account with an optional description.
 * Includes form validation, API communication, and status feedback.
 */
const Deposit = () => {
  // State management for form inputs and UI states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the deposit form submission
   * Validates inputs, communicates with API, and handles response
   */
  const handleDeposit = async () => {
    try {
      // Reset status messages and set loading state
      setError("");
      setMessage("");
      setLoading(true);

      // Validate amount input
      if (!amount || amount <= 0) {
        setError("Vennligst oppgi et gyldig beløp");
        setLoading(false);
        return;
      }

      // Send deposit request to API
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bank/deposit`,
        {
          amount,
          description: description.trim() || "Innskudd",
        },
        { withCredentials: true, timeout: 5000 }
      );

      // Handle successful deposit
      setMessage(`Innskudd vellykket! Ny saldo: ${res.data.newBalance} kr`);
      setShowSuccess(true);
      setAmount("");
      setDescription("");

      // Hide success message after delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error depositing funds:", err);

      // Handle authentication errors
      if (err.response?.status === 401) {
        setError(
          "Du må være innlogget for å sette inn penger. Vennligst logg inn."
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // Handle other errors
        setError(
          err.response?.data?.message || "Feil ved innskudd. Prøv igjen senere."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Success message notification */}
      {message && (
        <div
          className={`transition-opacity duration-300 ${
            showSuccess ? "opacity-100" : "opacity-0"
          } bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center`}
        >
          <CheckCircle className="mr-2" size={20} />
          {message}
        </div>
      )}

      {/* Error message notification */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <XCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Amount input field */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Beløp (NOK)
          </label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            min="0"
            step="0.01"
          />
        </div>

        {/* Description input field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Beskrivelse (valgfritt)
          </label>
          <input
            id="description"
            type="text"
            placeholder="F.eks. Lønn, Overføring fra sparing"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            maxLength={100}
          />
        </div>

        {/* Deposit button with loading state */}
        <button
          onClick={handleDeposit}
          disabled={loading}
          className="w-full bg-red-600 text-white p-2 rounded mb-2 hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-300"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Behandler...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2" size={20} />
              Sett inn
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Deposit;
