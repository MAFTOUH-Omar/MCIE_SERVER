const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article.controller');

router.post('/', ArticleController.create);
router.get('/', ArticleController.show);
router.get('/:id', ArticleController.showById);
router.put('/:id/publish', ArticleController.publish);
router.put('/:id/hide', ArticleController.hide);
router.put('/:id', ArticleController.update);
router.put('/:id/image' , ArticleController.updateImage);
router.delete('/:id', ArticleController.delete);

module.exports = router;