// middleware/roleMiddleware.js

// Middleware to check if the user has the "owner" role
const isowner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. owner only.' });
  }
  next();
};

// Middleware to allow multiple roles (e.g., owner, Admin, Viewer)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { isowner, authorizeRoles };
