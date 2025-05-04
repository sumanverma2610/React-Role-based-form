const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, phone, password, role, otp } = req.body;

  try {
    // Check if the user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user and OTP in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        otp,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route (OTP + Role Validation)
app.post("/api/login", async (req, res) => {
  const { email, password, otp, role } = req.body;

  try {
    // Fetch user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Validate OTP
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // Validate Role
    if (user.role !== role.toUpperCase()) {
      return res.status(400).json({ message: "Role mismatch" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Route Example (Dashboard)
app.get("/api/dashboard", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    res.json({ message: "Welcome to Dashboard", user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
