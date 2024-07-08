const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/general', reviewsController.getGeneralReviews);
router.post('/general', upload.none(), reviewsController.createGeneralReview);

router.get('/product/:product_id', reviewsController.getReviewsByProductId);
router.post('/product/:product_id', upload.none(), reviewsController.createProductReview);

router.get('/certificate/', reviewsController.getCertificateReviews);
router.post('/certificate/', upload.none(), reviewsController.createCertificateReview);

router.get('/:id', upload.none(), reviewsController.getReview);
router.put('/:id', upload.none(), reviewsController.updateReview);
router.delete('/:id', upload.none(), reviewsController.deleteReview);

module.exports = router;
