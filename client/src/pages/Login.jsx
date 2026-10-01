import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />
      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} required />
      <button className="full" type="submit">Login</button>
      {error && <p className="error">{error}</p>}
      <p className="muted">New here? <Link to="/register">Register</Link></p>
    </form>
  );
}
