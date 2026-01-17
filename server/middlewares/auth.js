const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
  req.user = null;
  res.locals.user = null;

  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    // For API, we might want to return 401 if auth is strictly required, 
    // but the original logic just passed next() with no user. 
    // We will keep it lenient here but routes that need auth should check req.user
    return next();
  }

  const payload = getUser(token);
  if (!payload) {
    return next();
  }

  req.user = {
    id: payload._id,
    email: payload.email,
    role: payload.role,
  };
  res.locals.user = req.user;
  next();
}

module.exports = checkForAuthentication;
