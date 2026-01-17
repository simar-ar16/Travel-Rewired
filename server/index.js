require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const cors = require('cors');

// Allow requests from Vite client
app.use(cors({
  origin: true, // Allow any origin for development
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// View engine removed for React migration
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public'))); // Serve static files if needed (e.g. uploads)
const checkForAuthentication = require('./middlewares/auth');

app.use(checkForAuthentication);

const contactRoutes = require('./routes/contact');
app.use('/contact', contactRoutes);
const authRoutes = require('./routes/user');
app.use('/user', authRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
const destinationRoutes = require('./routes/destinations');
app.use('/destinations', destinationRoutes);
const tripRoute = require('./routes/tripPlanner');
app.use('/trip-planner', tripRoute);
const guideRoute = require('./routes/guide');
app.use('/guide', guideRoute);
const bookRoute = require('./routes/booking');
app.use('/book-guide', bookRoute);
const chatRoute = require('./routes/chat');
app.use('/chat', chatRoute);
const reviewRoute = require('./routes/reviews');
app.use('/reviews', reviewRoute);
const blogRoute = require('./routes/blogs');
app.use('/blogs', blogRoute);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
