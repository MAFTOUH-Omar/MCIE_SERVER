const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activity.controller');

router.post('/', ActivityController.create);
router.get('/', ActivityController.show);
router.get('/:id', ActivityController.showById);
router.put('/:id', ActivityController.update);
router.put('/:id/publish', ActivityController.publish);
router.put('/:id/hide', ActivityController.hide);
router.put('/:id/image' , ActivityController.updateImage);
router.delete('/:id', ActivityController.delete);

module.exports = router;