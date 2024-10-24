const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    console.log('No token found, redirecting to login.');
    return res.status(401).redirect('/auth/login');  
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token :( waaaaaaaaaaaa' });
  }
}
module.exports = authenticateToken;
