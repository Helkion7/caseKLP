import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="landing-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#333333",
          fontSize: "2.5rem",
          marginBottom: "1rem",
        }}
      >
        Velkommen til vår Bank
      </h1>
      <p
        style={{
          color: "#666666",
          fontSize: "1.1rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Logg inn eller opprett en ny konto for å komme i gang.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{
          backgroundColor: "#ff0000",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          fontSize: "1rem",
          marginBottom: "1rem",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Logg inn
      </button>
      <button
        onClick={() => navigate("/register")}
        style={{
          backgroundColor: "#ff0000",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Registrer bruker
      </button>
    </div>
  );
};

export default LandingPage;
