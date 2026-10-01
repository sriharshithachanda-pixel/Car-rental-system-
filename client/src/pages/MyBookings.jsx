import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(`/bookings/user/${user._id}`)
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (!user) return <p>Please <Link to="/login">login</Link> first.</p>;

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await api.put(`/bookings/${id}/cancel`);
    load();
  };

  return (
    <div>
      <h2>My Bookings</h2>
      {loading && <p>Loading...</p>}
      {!loading && bookings.length === 0 && <p>No bookings yet. <Link to="/">Browse cars</Link></p>}

      {bookings.map((b) => (
        <div key={b._id} className="card booking">
          <img
            src={b.car?.imageUrl || "https://placehold.co/180x120?text=Car"}
            alt={b.car?.name || "Car"}
            onError={(e) => { e.target.src = "https://placehold.co/180x120?text=Car"; }}
          />
          <div className="info">
            <b>{b.car?.name || "Car no longer available"}</b>{" "}
            <span className={`badge ${b.status}`}>{b.status}</span>
            <div className="muted">
              {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="price">₹{b.totalPrice}</div>
          {b.status === "confirmed" && (
            <button className="danger" onClick={() => cancel(b._id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}
