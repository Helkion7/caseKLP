import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <h1 className="text-gray-800 text-4xl mb-4">Velkommen til vår Bank</h1>
      <p className="text-gray-600 text-lg mb-8 text-center">
        Logg inn eller opprett en ny konto for å komme i gang.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-red-600 text-white border-none px-5 py-2 text-lg mb-4 cursor-pointer rounded"
      >
        Logg inn
      </button>
      <button
        onClick={() => navigate("/register")}
        className="bg-red-600 text-white border-none px-5 py-2 text-lg cursor-pointer rounded"
      >
        Registrer bruker
      </button>
    </div>
  );
};

export default LandingPage;
