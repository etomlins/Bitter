const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route, accessible only with a valid token!" });
});

module.exports = router;
