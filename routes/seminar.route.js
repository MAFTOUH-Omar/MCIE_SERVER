const express = require('express');
const router = express.Router();
const SeminarController = require('../controllers/seminar.controller');

router.post('/', SeminarController.create);
router.get('/', SeminarController.show);
router.get('/:id', SeminarController.showById);
router.put('/:id', SeminarController.update);
router.put('/:id/publish', SeminarController.publish);
router.put('/:id/hide', SeminarController.hide);
router.put('/:id/image', SeminarController.updateImage);
router.delete('/:id', SeminarController.delete);

module.exports = router;