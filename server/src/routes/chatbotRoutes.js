const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/reply', chatbotController.reply);
router.post('/simulate', chatbotController.simulate);
router.get('/status', chatbotController.checkStatus);
router.get('/configs', chatbotController.getConfigs);
router.post('/configs', chatbotController.updateConfigs);
router.get('/logs', chatbotController.getLogs);
router.get('/simulator-history', chatbotController.getSimulatorHistory);

module.exports = router;
