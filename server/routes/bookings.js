const router = require("express").Router();
const Booking = require("../models/Booking");
const Car = require("../models/Car");

const DAY = 1000 * 60 * 60 * 24;

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { userId, carId, startDate, endDate } = req.body;

    if (!userId) return res.status(400).json({ message: "Please login first" });
    if (!startDate || !endDate)
      return res.status(400).json({ message: "Select start and end dates" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today)
      return res.status(400).json({ message: "Start date cannot be in the past" });
    if (end <= start)
      return res.status(400).json({ message: "End date must be after start date" });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Overlap check (ignore cancelled bookings)
    const clash = await Booking.findOne({
      car: carId,
      status: "confirmed",
      startDate: { $lt: end },
      endDate: { $gt: start },
    });
    if (clash)
      return res.status(400).json({ message: "Car already booked for these dates" });

    const days = Math.ceil((end - start) / DAY);
    const booking = await Booking.create({
      user: userId,
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice: days * car.pricePerDay,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/cancel
router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
