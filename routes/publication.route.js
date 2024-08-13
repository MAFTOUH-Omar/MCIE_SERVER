const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication.controller');

router.post('/', PublicationController.create);
router.get('/', PublicationController.show);
router.get('/:id', PublicationController.showById);
router.put('/:id', PublicationController.update);
router.patch('/:id/publish', PublicationController.publish);
router.patch('/:id/hide', PublicationController.hide);
router.patch('/:id/image', PublicationController.updateImage);
router.delete('/:id', PublicationController.delete);

module.exports = router;