const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getOne);
router.post('/', authMiddleware, orderController.create);
router.put('/:id/status', authMiddleware, orderController.updateStatus);
router.delete('/:id', authMiddleware, orderController.remove);

module.exports = router;
