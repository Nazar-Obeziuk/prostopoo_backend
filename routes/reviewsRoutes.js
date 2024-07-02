const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.get('/general', reviewsController.getGeneralReviews);
router.post('/general', reviewsController.createGeneralReview);

router.get('/product/:product_id', reviewsController.getReviewsByProductId);
router.post('/product/:product_id', reviewsController.createProductReview);


module.exports = router;
