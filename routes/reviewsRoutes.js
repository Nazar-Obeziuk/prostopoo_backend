const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/general', reviewsController.getGeneralReviews);
router.post('/general', reviewsController.createGeneralReview);

router.get('/product/:product_id', reviewsController.getReviewsByProductId);
router.post('/product/:product_id', reviewsController.createProductReview);

router.get('/:id', reviewsController.getReview);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
