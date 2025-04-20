const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    fullname,
    phone,
    profilePicture,
    addresses,
    role,
    deviceInfo
  } = req.body;

  // Check mandatory fields
  if (!email || !password || !fullname) {
    return res.status(400).json({ msg: "Email, password, and fullname are required." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullname,
      phone,
      profilePicture,
      addresses,
      role,
      deviceInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
