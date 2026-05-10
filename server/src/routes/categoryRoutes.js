const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, isAdmin, categoryController.create);
router.put('/:id', authMiddleware, isAdmin, categoryController.update);
router.delete('/:id', authMiddleware, isAdmin, categoryController.remove);

module.exports = router;
