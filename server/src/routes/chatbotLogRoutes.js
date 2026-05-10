const express = require('express');
const router = express.Router();
const chatbotLogController = require('../controllers/chatbotLogController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, chatbotLogController.getLogs);

module.exports = router;
