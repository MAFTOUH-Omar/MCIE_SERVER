const express = require('express');
const router = express.Router();
const DialogController = require('../controllers/dialog.controller');

router.post('/', DialogController.create);
router.get('/', DialogController.show);
router.get('/:id', DialogController.showById);
router.put('/:id', DialogController.update);
router.patch('/:id/publish', DialogController.publish);
router.patch('/:id/hide', DialogController.hide);
router.put('/:id/image', DialogController.updateImage);
router.delete('/:id', DialogController.delete);

module.exports = router;