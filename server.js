// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();

// Middleware
app.use(cors());        // Allow frontend requests
app.use(express.json());        // Parse JSON request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {           //connects mongo database to node
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    doctor: { type: String, required: true },
    date: { type: String, required: true },
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// Appointment Model
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Route to save appointment
app.post("/api/book", async (req, res) => {
    try {
        const { name, phone, email,doctor, date, message } = req.body;
        if (!name || !phone || !email || !date || !doctor) {
            return res.status(400).json({ error: "All fields except message are required" });
        }

        const newAppointment = new Appointment({ name, phone, email,doctor, date, message });
        await newAppointment.save();

        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error("Error saving appointment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Optional: Route to get all appointments


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
