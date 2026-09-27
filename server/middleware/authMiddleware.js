const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT sent in the Authorization header (Bearer token).
 * Attaches the decoded payload to req.user on success.
 * Responds with 401 when authentication fails.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;

/**
 * Like authMiddleware but does not block the request when no/invalid token
 * is present - it simply leaves req.user undefined. Useful for public GET
 * routes that return extra data (e.g. hidden items) to authenticated admins.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
}

module.exports.optionalAuth = optionalAuth;
