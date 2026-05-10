const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', authMiddleware, isAdmin, productController.create);
router.put('/:id', authMiddleware, isAdmin, productController.update);
router.delete('/:id', authMiddleware, isAdmin, productController.remove);

module.exports = router;
