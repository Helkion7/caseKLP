import React, { useState } from "react";
import axios from "axios"; // Added missing import

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(""); // Added missing state for msg

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { name, email, password, repeatPassword: confirmPassword },
        {
          withCredentials: true,
          timeout: 5000,
        }
      );

      console.log(response.data, "RESPONSE DATA");
      setMsg(response.data.msg);
    } catch (error) {
      console.error("Registration error:", error);
      setMsg("Registration failed. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirm Password: </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      {msg && <p>{msg}</p>} {/* Added to display registration message */}
    </form>
  );
};

export default Register;
