import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { name, email, password, repeatPassword },
        { withCredentials: true, timeout: 5000 }
      );
      setMsg(response.data.msg);
      if (response.data.success) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMsg(error.response?.data?.msg || "Register failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <h1 className="text-gray-800 text-4xl mb-4">Registrer Deg</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Fullt Navn"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-red-600"
          />
        </div>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            placeholder="E-post"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-red-600"
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passord"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-red-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Bekreft Passord"
            required
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-red-600"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Registrer
        </button>
      </form>
      {msg && <p className="text-gray-800 mt-4">{msg}</p>}
      <button
        onClick={() => navigate("/login")}
        className="mt-4 text-red-600 hover:underline"
      >
        Har allerede en konto? Logg Inn
      </button>
    </div>
  );
};

export default Register;
