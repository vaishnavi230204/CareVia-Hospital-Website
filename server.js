
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Patient Schema with validation
const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    message: { type: String }
});

const Patient = mongoose.model("Patient", PatientSchema);

// Route to handle form submission
app.post("/api/book", async (req, res) => {
    try {
        const { name, email, phone, date, message } = req.body;
        if (!name || !email || !phone || !date) {
            return res.status(400).json({ error: "All fields except message are required" });
        }
        const newPatient = new Patient({ name, email, phone, date, message });
        await newPatient.save();
        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all appointments
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Patient.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
