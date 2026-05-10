const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/stats', authMiddleware, dashboardController.getStats);
router.get('/search', authMiddleware, dashboardController.globalSearch);

module.exports = router;
