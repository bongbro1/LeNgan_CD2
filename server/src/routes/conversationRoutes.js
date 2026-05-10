const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', conversationController.getAll);
router.get('/:id', conversationController.getOne);
router.post('/create-from-customer', conversationController.createFromCustomer);
router.post('/:id/messages', conversationController.sendMessage); // Public for simulator
router.delete('/:id', authMiddleware, conversationController.remove);

module.exports = router;
