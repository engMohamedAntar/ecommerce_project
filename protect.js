//protect.js
module.exports = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    status: "fail",
    message: "You must be logged in to access this resource",
  });
};
