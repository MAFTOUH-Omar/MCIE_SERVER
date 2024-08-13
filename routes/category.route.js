const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');

router.post('/', CategoryController.create);
router.get('/', CategoryController.show);
router.get('/:id', CategoryController.showById);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

module.exports = router;