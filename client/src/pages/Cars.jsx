import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const today = new Date().toISOString().split("T")[0];

function CarCard({ car, user, onDeleted }) {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const navigate = useNavigate();

  const book = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/bookings", { userId: user._id, carId: car._id, ...dates });
      alert("Booking confirmed!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${car.name}?`)) return;
    try {
      await api.delete(`/cars/${car._id}`);
      onDeleted();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="card car">
      <img
        src={car.imageUrl || "https://placehold.co/400x240?text=No+Image"}
        alt={car.name}
        onError={(e) => { e.target.src = "https://placehold.co/400x240?text=No+Image"; }}
      />
      <div className="body">
        <h3>{car.name}</h3>
        <div className="muted">
          {car.brand} · {car.seats} seats · {car.transmission} · {car.fuel}
        </div>
        <div className="price">₹{car.pricePerDay} <span className="muted">/ day</span></div>

        <label>From</label>
        <input type="date" min={today} value={dates.startDate}
          onChange={(e) => setDates({ ...dates, startDate: e.target.value })} />
        <label>To</label>
        <input type="date" min={dates.startDate || today} value={dates.endDate}
          onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />

        <button onClick={book}>Book Now</button>

        {user && (
          <div className="row">
            <Link to={`/edit-car/${car._id}`} style={{ flex: 1 }}>
              <button className="secondary" style={{ width: "100%" }}>Edit</button>
            </Link>
            <button className="danger" style={{ flex: 1 }} onClick={remove}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Cars({ user }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "", transmission: "", fuel: "", seats: "", maxPrice: "",
  });

  const load = () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    setLoading(true);
    api.get("/cars", { params })
      .then((res) => setCars(res.data))
      .finally(() => setLoading(false));
  };

  // Debounced fetch whenever filters change
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const set = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div>
      <h2>Available Cars</h2>

      <div className="card filters">
        <input name="q" placeholder="Search name or brand" value={filters.q} onChange={set} />
        <select name="transmission" value={filters.transmission} onChange={set}>
          <option value="">Any transmission</option>
          <option>Manual</option>
          <option>Automatic</option>
        </select>
        <select name="fuel" value={filters.fuel} onChange={set}>
          <option value="">Any fuel</option>
          <option>Petrol</option>
          <option>Diesel</option>
          <option>Electric</option>
          <option>CNG</option>
        </select>
        <input name="seats" type="number" min="1" placeholder="Min seats" value={filters.seats} onChange={set} />
        <input name="maxPrice" type="number" min="0" placeholder="Max ₹/day" value={filters.maxPrice} onChange={set} />
        <button className="secondary"
          onClick={() => setFilters({ q: "", transmission: "", fuel: "", seats: "", maxPrice: "" })}>
          Clear
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && cars.length === 0 && (
        <p>No cars found.{user && <> <Link to="/add-car">Add one</Link>.</>}</p>
      )}

      <div className="grid">
        {cars.map((c) => <CarCard key={c._id} car={c} user={user} onDeleted={load} />)}
      </div>
    </div>
  );
}
