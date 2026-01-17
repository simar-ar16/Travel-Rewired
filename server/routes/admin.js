const express = require('express');
const router = express.Router();
const checkAdmin = require('../middlewares/checkAdmin');
const Destination = require('../models/destination');
const upload = require('../middlewares/upload');
const Contact = require('../models/contact');
const Guide = require('../models/Guide');
const User = require('../models/User');
const TripPlan = require('../models/TripPlan');
const BookingRequest = require('../models/BookingRequest');
const Blog = require('../models/Blog');

router.get('/guides', checkAdmin, async (req, res) => {
  try {
    const pendingGuides = await Guide.find({ status: 'pending' }).populate('user');
    const verifiedGuides = await Guide.find({ status: 'verified' }).populate('user');
    res.json({ pendingGuides, verifiedGuides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load guides' });
  }
});

router.post('/guides/:id/approve', checkAdmin, async (req, res) => {
  await Guide.findByIdAndUpdate(req.params.id, { status: 'verified' });
  res.json({ success: true, message: 'Guide approved' });
});

router.post('/guides/:id/reject', checkAdmin, async (req, res) => {
  await Guide.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ success: true, message: 'Guide rejected' });
});


router.get('/analytics', checkAdmin, (req, res) => {
  res.json({ user: req.user });
});

router.get('/destinations', checkAdmin, async (req, res) => {
  const destinations = await Destination.find();
  res.json({ destinations });
});

// GET add form (removed, client handles form)
// router.get('/destinations/add', ...);

router.post('/destinations/add', checkAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, bestTimeToVisit } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const mustVisitArray = req.body.mustVisit
      ? req.body.mustVisit.split(',').map(item => item.trim())
      : [];

    const newDestination = new Destination({
      name,
      description,
      bestTimeToVisit,
      imageUrl,
      mustVisit: mustVisitArray
    });

    await newDestination.save();
    res.json({ success: true, message: 'Destination added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET edit form
router.get('/destinations/edit/:id', checkAdmin, async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ error: 'Destination not found' });
  res.json({ destination });
});

// POST update destination
router.post('/destinations/edit/:id', checkAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, bestTimeToVisit, mustVisit } = req.body;
    const mustVisitArray = mustVisit
      ? mustVisit.split(',').map(item => item.trim())
      : [];

    let updateData = { name, description, bestTimeToVisit, mustVisit: mustVisitArray };

    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary URL
    }

    await Destination.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: 'Destination updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST delete destination
router.post('/destinations/delete/:id', checkAdmin, async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/contacts', checkAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET Users - API
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await User.find().lean();

    const guides = await Guide.find().lean();
    users.forEach(user => {
      if (user.role === 'guide') {
        const guideProfile = guides.find(g => g.user.toString() === user._id.toString());
        user.guideId = guideProfile ? guideProfile._id : null;
      }
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading users' });
  }
});

router.get('/trips', checkAdmin, async (req, res) => {
  try {
    const trips = await TripPlan.find()
      .populate('user', 'name email')
      .populate('destination', 'name')
      .sort({ addedAt: -1 })
      .lean();

    const tripsWithAcceptedBookings = await Promise.all(
      trips.map(async (trip) => {
        // Only fetch accepted bookings
        const bookings = await BookingRequest.find({ trip: trip._id, status: 'accepted' })
          .populate('guide')
          .lean();
        return { ...trip, bookings };
      })
    );

    res.json({ trips: tripsWithAcceptedBookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading trips' });
  }
});

router.get('/blogs', checkAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 }) // newest first
      .lean();
    const guides = await Guide.find();
    res.json({ blogs, guides });
  } catch (err) {
    console.error('Error fetching blogs for admin:', err);
    res.status(500).json({ error: 'Error loading blogs' });
  }
});

router.post('/blogs/:blogId/delete', checkAdmin, async (req, res) => {
  const { blogId } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});
module.exports = router;
