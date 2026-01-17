const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.get('/', (req, res) => {
  res.json({ message: 'Contact form' });
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
