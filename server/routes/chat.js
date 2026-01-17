const express = require('express');
const router = express.Router();
const checkAdmin = require('../middlewares/checkAdmin');
const BookingRequest = require('../models/BookingRequest');
const ChatMessage = require('../models/ChatMessage');
const checkForAuthentication = require('../middlewares/auth');

router.get('/:bookingId', checkForAuthentication, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await BookingRequest.findById(req.params.bookingId)
      .populate('traveler')
      .populate({
        path: 'guide',
        populate: {
          path: 'user'
        }
      })
      .populate({
        path: 'trip',
        populate: {
          path: 'destination'
        }
      });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Authorization: allow only traveler, guide, admin linked to booking
    const userId = req.user.id;

    if (
      ![booking.traveler.id.toString(), booking.guide.user._id.toString()].includes(userId) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Fetch all chat messages for booking sorted by createdAt
    const messages = await ChatMessage.find({ booking: bookingId })
      .populate('sender', 'name profileImage')
      .sort('createdAt')
      .exec();

    res.json({ booking, messages, userId, userRole: req.user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:bookingId', checkForAuthentication, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Verify booking exists and user authorized (same as above)
    const booking = await BookingRequest.findById(bookingId)
      .populate({
        path: 'guide',
        populate: { path: 'user' }
      });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (
      ![booking.traveler.toString(), booking.guide.user._id.toString()].includes(userId) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Save message
    const newMsg = new ChatMessage({
      booking: bookingId,
      sender: userId,
      message: message.trim()
    });
    await newMsg.save();

    res.json({ success: true, message: 'Message sent', newMessage: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;