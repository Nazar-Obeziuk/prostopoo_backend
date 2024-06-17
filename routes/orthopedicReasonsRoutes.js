const express = require('express');
const router = express.Router();
const orthopedicReasonsController = require('../controllers/orthopedicReasonsController');

router.get('/', orthopedicReasonsController.getOrthopedicReasons);
router.post('/', orthopedicReasonsController.postOrthopedicReasons);
router.delete('/:id', orthopedicReasonsController.deleteOrthopedicReasons);

module.exports = router;
