import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <label>Name</label>
      <input name="name" value={form.name} onChange={handleChange} required />
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />
      <label>Password (min 6 characters)</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} required />
      <button className="full" type="submit">Register</button>
      {error && <p className="error">{error}</p>}
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
