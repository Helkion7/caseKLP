import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MinusCircle,
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
} from "lucide-react";

/**
 * Withdraw Component
 *
 * Allows users to withdraw funds from their account with a two-step confirmation process.
 * Includes form validation, confirmation dialog, and status feedback.
 */
const Withdraw = () => {
  // State management for form inputs and UI states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  /**
   * Initial validation before showing confirmation dialog
   */
  const handleWithdrawRequest = () => {
    if (!amount || amount <= 0) {
      setError("Vennligst oppgi et gyldig beløp");
      return;
    }

    setError("");
    setShowConfirmation(true);
  };

  /**
   * Handles the actual withdrawal after user confirms
   */
  const handleWithdrawConfirm = async () => {
    try {
      // Reset status messages and set loading state
      setError("");
      setMessage("");
      setLoading(true);

      // Send withdrawal request to API
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bank/withdraw`,
        {
          amount,
          description: description.trim() || "Uttak",
        },
        { withCredentials: true, timeout: 5000 }
      );

      // Handle successful withdrawal
      setMessage(`Uttak vellykket! Ny saldo: ${res.data.newBalance} kr`);
      setShowSuccess(true);
      setAmount("");
      setDescription("");
      setShowConfirmation(false);

      // Hide success message after delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error withdrawing funds:", err);

      // Handle authentication errors
      if (err.response?.status === 401) {
        setError(
          "Du må være innlogget for å ta ut penger. Vennligst logg inn."
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // Handle other errors
        setError(
          err.response?.data?.message || "Feil ved uttak. Prøv igjen senere."
        );
      }
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels the withdrawal and hides confirmation dialog
   */
  const handleWithdrawCancel = () => {
    setShowConfirmation(false);
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

      {/* Conditional rendering based on confirmation state */}
      {showConfirmation ? (
        // Confirmation dialog
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start mb-3">
            <AlertCircle
              className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
              size={20}
            />
            <div>
              <h3 className="font-medium text-yellow-700">Bekreft uttak</h3>
              <p className="text-yellow-600 mt-1">
                Er du sikker på at du vil ta ut{" "}
                {parseFloat(amount).toLocaleString("no-NO", {
                  style: "currency",
                  currency: "NOK",
                })}
                ?
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {/* Confirm button with loading state */}
            <button
              onClick={handleWithdrawConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-300"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Behandler...
                </>
              ) : (
                "Bekreft uttak"
              )}
            </button>

            {/* Cancel button */}
            <button
              onClick={handleWithdrawCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-100"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        // Withdrawal form
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
              placeholder="F.eks. Dagligvarer, Regning"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              maxLength={100}
            />
          </div>

          {/* Withdraw button */}
          <button
            onClick={handleWithdrawRequest}
            className="w-full bg-red-600 text-white p-2 rounded mb-2 hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <MinusCircle className="mr-2" size={20} />
            Ta ut
          </button>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
