const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    imageUrl: { type: String, default: "" },
    seats: { type: Number, default: 5, min: 1 },
    transmission: { type: String, enum: ["Manual", "Automatic"], default: "Manual" },
    fuel: { type: String, enum: ["Petrol", "Diesel", "Electric", "CNG"], default: "Petrol" },
    pricePerDay: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
