import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

const empty = {
  name: "",
  brand: "",
  imageUrl: "",
  seats: 5,
  transmission: "Manual",
  fuel: "Petrol",
  pricePerDay: "",
};

// Used for both "Add Car" (/add-car) and "Edit Car" (/edit-car/:id)
export default function CarForm({ user }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/cars/${id}`).then((res) => setForm({ ...empty, ...res.data }))
        .catch(() => setError("Could not load car"));
    } else {
      setForm(empty);
    }
  }, [id, isEdit]);

  if (!user) return <p>Please <Link to="/login">login</Link> first.</p>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      brand: form.brand,
      imageUrl: form.imageUrl,
      seats: Number(form.seats),
      transmission: form.transmission,
      fuel: form.fuel,
      pricePerDay: Number(form.pricePerDay),
    };
    try {
      if (isEdit) await api.put(`/cars/${id}`, payload);
      else await api.post("/cars", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit Car" : "Add Car"}</h2>
      <label>Car name</label>
      <input name="name" value={form.name} onChange={handleChange} required />
      <label>Brand</label>
      <input name="brand" value={form.brand} onChange={handleChange} />
      <label>Image URL (optional)</label>
      <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
      <label>Seats</label>
      <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} />
      <label>Transmission</label>
      <select name="transmission" value={form.transmission} onChange={handleChange}>
        <option>Manual</option>
        <option>Automatic</option>
      </select>
      <label>Fuel</label>
      <select name="fuel" value={form.fuel} onChange={handleChange}>
        <option>Petrol</option>
        <option>Diesel</option>
        <option>Electric</option>
        <option>CNG</option>
      </select>
      <label>Price per day (₹)</label>
      <input name="pricePerDay" type="number" min="0" value={form.pricePerDay} onChange={handleChange} required />
      <button className="full" type="submit">{isEdit ? "Save Changes" : "Add Car"}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
