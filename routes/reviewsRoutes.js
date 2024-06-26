const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', reviewsController.getReviews);
router.get('/:id', reviewsController.getReview);

router.post('/', authenticateToken, authorizeAdmin, reviewsController.createReview);
router.put('/:id', authenticateToken, authorizeAdmin, reviewsController.updateReview);
router.delete('/:id', authenticateToken, authorizeAdmin, reviewsController.deleteReview);

module.exports = router;
