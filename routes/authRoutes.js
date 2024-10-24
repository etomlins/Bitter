const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/register', authController.signup_get);
router.post('/register', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;
