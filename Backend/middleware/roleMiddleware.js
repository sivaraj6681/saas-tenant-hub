// middleware/roleMiddleware.js

// Middleware to check if the user has the "Owner" role
const isOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Owner only.' });
  }
  next();
};

// Middleware to allow multiple roles (e.g., Owner, Admin, Viewer)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { isOwner, authorizeRoles };
