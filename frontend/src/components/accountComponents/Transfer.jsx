import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
} from "lucide-react";

/**
 * Transfer Component
 *
 * Allows users to transfer money to another account with a two-step confirmation process.
 * Includes form validation, confirmation dialog, and status feedback.
 */
const Transfer = () => {
  // State management for form inputs and UI states
  const [recipientAccount, setRecipientAccount] = useState("");
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
  const handleTransferRequest = () => {
    // Validate account number - basic Norwegian account number validation (11 digits)
    if (
      !recipientAccount ||
      !/^\d{11}$/.test(recipientAccount.replace(/\s/g, ""))
    ) {
      setError("Vennligst oppgi et gyldig kontonummer (11 siffer)");
      return;
    }

    // Validate amount
    if (!amount || amount <= 0) {
      setError("Vennligst oppgi et gyldig beløp");
      return;
    }

    setError("");
    setShowConfirmation(true);
  };

  /**
   * Handles the actual transfer after user confirms
   */
  const handleTransferConfirm = async () => {
    try {
      // Reset status messages and set loading state
      setError("");
      setMessage("");
      setLoading(true);

      // Send transfer request to API
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bank/transfer`,
        {
          recipientAccount: recipientAccount.replace(/\s/g, ""),
          amount,
          description: description.trim() || "Overføring",
        },
        { withCredentials: true, timeout: 5000 }
      );

      // Handle successful transfer
      setMessage(`Overføring vellykket! Ny saldo: ${res.data.newBalance} kr`);
      setShowSuccess(true);
      setRecipientAccount("");
      setAmount("");
      setDescription("");
      setShowConfirmation(false);

      // Hide success message after delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error transferring funds:", err);

      // Handle authentication errors
      if (err.response?.status === 401) {
        setError(
          "Du må være innlogget for å overføre penger. Vennligst logg inn."
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // Handle other errors
        setError(
          err.response?.data?.message ||
            "Feil ved overføring. Prøv igjen senere."
        );
      }
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels the transfer and hides confirmation dialog
   */
  const handleTransferCancel = () => {
    setShowConfirmation(false);
  };

  // Format account number with spaces for better readability
  const formatAccountNumber = (value) => {
    // Remove all spaces first
    const cleaned = value.replace(/\s/g, "");

    // Only keep digits
    const digits = cleaned.replace(/\D/g, "");

    // Format with spaces after every 4 digits (Norwegian style)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Handle account number input with formatting
  const handleAccountNumberChange = (e) => {
    const formatted = formatAccountNumber(e.target.value);
    setRecipientAccount(formatted);
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
              <h3 className="font-medium text-yellow-700">
                Bekreft overføring
              </h3>
              <p className="text-yellow-600 mt-1">
                Er du sikker på at du vil overføre{" "}
                {parseFloat(amount).toLocaleString("no-NO", {
                  style: "currency",
                  currency: "NOK",
                })}{" "}
                til kontonummer {recipientAccount}?
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {/* Confirm button with loading state */}
            <button
              onClick={handleTransferConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-300"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Behandler...
                </>
              ) : (
                "Bekreft overføring"
              )}
            </button>

            {/* Cancel button */}
            <button
              onClick={handleTransferCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-100"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        // Transfer form
        <div className="space-y-4">
          {/* Account number input field */}
          <div>
            <label
              htmlFor="recipientAccount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mottakers kontonummer
            </label>
            <input
              id="recipientAccount"
              type="text"
              placeholder="xxxx xxxx xxxx"
              value={recipientAccount}
              onChange={handleAccountNumberChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              maxLength={14} // 11 digits + 2 spaces
            />
          </div>

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
              placeholder="F.eks. Gave, Betaling, Tilbakebetaling"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              maxLength={100}
            />
          </div>

          {/* Transfer button */}
          <button
            onClick={handleTransferRequest}
            className="w-full bg-red-600 text-white p-2 rounded mb-2 hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <ArrowRight className="mr-2" size={20} />
            Overfør
          </button>
        </div>
      )}
    </div>
  );
};

export default Transfer;
