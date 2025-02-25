import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true, timeout: 5000 }
      );
      setMsg(response.data.msg);
      if (response.data.success) {
        setTimeout(() => navigate("/Account"), 2000);
      }
    } catch (error) {
      setMsg(error.response?.data?.msg || "Login failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <h1 className="text-gray-800 text-4xl mb-4">Logg Inn</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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
        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logg Inn
        </button>
      </form>
      {msg && <p className="text-gray-800 mt-4">{msg}</p>}
      <button
        onClick={() => navigate("/register")}
        className="mt-4 text-red-600 hover:underline"
      >
        Har du ikke en konto? Registrer deg
      </button>
    </div>
  );
};

export default Login;
