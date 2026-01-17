const express = require('express');
const { setUser } = require('../service/auth');
const User = require('../models/User');
const router = express.Router();
const checkForAuthentication = require('../middlewares/auth');
const allowRoles = require('../middlewares/roleCheck')
const multer = require('multer');
const { userProfileStorage } = require('../config/cloudinary');
const uploadUP = multer({ storage: userProfileStorage });
const sendOtp = require('../utils/sendOtp');

router.post('/remove-profile-image', checkForAuthentication, allowRoles('traveler', 'admin'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { profileImage: '' });
    res.json({ success: true, message: 'Profile photo removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to remove profile photo');
  }
});

// GET Profile - API
router.get('/profile', checkForAuthentication, allowRoles('traveler', 'admin'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST Update Profile
// POST Update Profile - API
router.post('/profile', checkForAuthentication, allowRoles('traveler', 'admin'), uploadUP.single('profileImage'), async (req, res) => {
  try {
    const updateData = {
      aboutMe: req.body.aboutMe,
      location: req.body.location,
      phone: req.body.phone,
    };

    if (req.file) {
      updateData.profileImage = req.file.path; // URL from Cloudinary
    }

    await User.findByIdAndUpdate(req.user.id, updateData);
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Render routes removed for API
// router.get('/signup', ...);
// router.get('/login', ...);


router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).render('signup', { error: 'Email and password required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If verified user exists, block signup
    if (user && user.isVerified) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user && !user.isVerified) {
      // Unverified user → update OTP, password, and name
      user.name = name;
      user.passwordHash = password; // pre-save hook will hash it
      user.role = role || 'traveler';
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send OTP
      await sendOtp(email, otp);
      return res.json({ success: true, message: 'OTP resent. Please verify.', email });
    }

    // New user → create document
    user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook will hash it
      role: role || 'traveler',
      isVerified: false,
      otp,
      otpExpires,
    });

    // Send OTP
    await sendOtp(email, otp);

    res.json({ success: true, message: 'OTP sent to your email', email });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid request');
    if (user.isVerified) return res.send('User already verified');

    if (user.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ error: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // After verification, return token
    const token = setUser(user); // your existing function

    // Cookie is optional for API, but good for persistence if client wants it
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.json({ success: true, token, user, redirectUrl: user.role === 'guide' ? '/guide/home' : '/home' });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'User not verified' });
    }

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = setUser(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.json({ success: true, token, user, redirectUrl: user.role === 'guide' ? '/guide/home' : '/home' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

router.get('/:id', allowRoles('admin', 'guide', 'traveler'), checkForAuthentication, async (req, res) => {
  try {
    const profileuser = await User.findById(req.params.id).lean();
    if (!profileuser) {
      return res.status(404).send('User not found');
    }
    if (profileuser.role !== 'traveler' && profileuser.role !== 'admin') {
      return res.status(404).send('User Not Found');
    }

    res.json({ profileuser, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
module.exports = router;
