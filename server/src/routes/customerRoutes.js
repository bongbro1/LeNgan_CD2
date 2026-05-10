const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', customerController.getAll);
router.get('/:id', authMiddleware, customerController.getOne);
router.post('/', authMiddleware, customerController.create);
router.put('/:id', authMiddleware, customerController.update);
router.delete('/:id', authMiddleware, customerController.remove);
router.put('/:id/rank', authMiddleware, customerController.updateRank);
router.post('/:id/notes', authMiddleware, customerController.addNote);

module.exports = router;
