// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Generate JWT access Token
const createToken = (user) => {             
  return jwt.sign (
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {expiresIn: '1h'}
    );
};



//POST   Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'All the fields are required'});

    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      username,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });


    res.status(201).json({ 
      message: 'User created successfully',
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token: createToken(user)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//POST   login
// POST login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(401).json({ message: 'User not found' });

    const matchPass = await user.matchPassword(password);
    if (!matchPass) 
      return res.status(401).json({ message: 'Invalid Password' });
    

    res.json({
      message: 'User login successfully',
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token: createToken(user)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


