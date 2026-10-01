const router = require("express").Router();
const Car = require("../models/Car");
const Booking = require("../models/Booking");

// GET /api/cars?q=&transmission=&fuel=&maxPrice=&seats=
router.get("/", async (req, res) => {
  try {
    const { q, transmission, fuel, maxPrice, seats } = req.query;
    const filter = {};

    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { brand: rx }];
    }
    if (transmission) filter.transmission = transmission;
    if (fuel) filter.fuel = fuel;
    if (maxPrice) filter.pricePerDay = { $lte: Number(maxPrice) };
    if (seats) filter.seats = { $gte: Number(seats) };

    res.json(await Car.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cars/:id
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: "Invalid car id" });
  }
});

// POST /api/cars
router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Car.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/cars/:id
router.put("/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/cars/:id  (blocked if it has upcoming confirmed bookings)
router.delete("/:id", async (req, res) => {
  try {
    const upcoming = await Booking.findOne({
      car: req.params.id,
      status: "confirmed",
      endDate: { $gte: new Date() },
    });
    if (upcoming)
      return res.status(400).json({ message: "Car has upcoming bookings and cannot be deleted" });

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
