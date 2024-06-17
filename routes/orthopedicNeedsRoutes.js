const express = require('express');
const router = express.Router();
const orthopedicNeedsController = require('../controllers/orthopedicNeedsController');

router.get('/', orthopedicNeedsController.getOrthopedicNeeds);
router.post('/', orthopedicNeedsController.addOrthopedicNeed);
router.delete('/:id', orthopedicNeedsController.deleteOrthopedicNeed);

module.exports = router;
