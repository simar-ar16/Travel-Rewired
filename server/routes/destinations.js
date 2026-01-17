const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
const allowRoles = require('../middlewares/roleCheck');

// Show all destinations to travellers
// Show all destinations to travellers - API
// Show all destinations to travellers - API
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json({ destinations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ destination });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
