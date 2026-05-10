const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Tất cả các route settings đều cần login
router.use(authMiddleware);

router.get('/profile', settingController.getProfile);
router.put('/profile', settingController.updateProfile);
router.put('/change-password', settingController.updatePassword);

router.get('/store', settingController.getStoreSettings);
router.put('/store', settingController.updateStoreSettings);

router.get('/ai-config', settingController.getAIConfig);
router.put('/ai-config', settingController.updateAIConfig);
router.post('/test-ai', settingController.testAI);

router.get('/social-integrations', settingController.getSocialIntegrations);
router.get('/configs', settingController.getConfigs);
router.put('/config/:key', settingController.updateConfigByKey);

module.exports = router;
