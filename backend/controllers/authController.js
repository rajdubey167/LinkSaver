const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, email, password, username' 
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ 
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 