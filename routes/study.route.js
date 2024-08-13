const express = require('express');
const router = express.Router();
const StudyController = require('../controllers/study.controller');

router.post('/', StudyController.create);
router.get('/', StudyController.show);
router.get('/:id', StudyController.showById);
router.put('/:id/update', StudyController.update);
router.put('/:id/publish', StudyController.publish);
router.put('/:id/hide', StudyController.hide);
router.put('/:id/update-image', StudyController.updateImage);
router.delete('/:id/delete', StudyController.delete);

module.exports = router;