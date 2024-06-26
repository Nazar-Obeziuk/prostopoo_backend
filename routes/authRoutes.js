const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);


router.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: 'Welcome to the admin panel!' });
});


module.exports = router;
