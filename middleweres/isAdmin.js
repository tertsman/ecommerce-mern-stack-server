module.exports = function isAdmin(req, res, next) {
  if (req.auth && req.auth.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
