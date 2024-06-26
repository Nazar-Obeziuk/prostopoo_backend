const express = require('express');
const router = express.Router();
const workersController = require('../controllers/workersController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', workersController.getWorkers);
router.get('/:id', workersController.getWorker);

router.post('/', authenticateToken, authorizeAdmin, workersController.createWorker);
router.put('/:id', authenticateToken, authorizeAdmin, workersController.updateWorker);
router.delete('/:id', authenticateToken, authorizeAdmin, workersController.deleteWorker);

module.exports = router;
