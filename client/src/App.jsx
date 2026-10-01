import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cars from "./pages/Cars";
import CarForm from "./pages/CarForm";
import MyBookings from "./pages/MyBookings";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(loadUser);
  const navigate = useNavigate();

  const handleLogin = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav>
        <Link to="/" className="brand">🚗 CarRental</Link>
        <Link to="/">Cars</Link>
        {user ? (
          <>
            <Link to="/add-car">Add Car</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <span className="spacer">Hi, {user.name}</span>
            <button className="secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="spacer">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Cars user={user} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/add-car" element={<CarForm user={user} />} />
          <Route path="/edit-car/:id" element={<CarForm user={user} />} />
          <Route path="/my-bookings" element={<MyBookings user={user} />} />
        </Routes>
      </div>
    </>
  );
}
