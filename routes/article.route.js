const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/article/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') , ArticleController.create);
router.get('/', ArticleController.show);
router.get('/:id', ArticleController.showById);
router.put('/:id/publish', ArticleController.publish);
router.put('/:id/hide', ArticleController.hide);
router.put('/:id', ArticleController.update);
router.put('/:id/image' ,  upload.single('image') , ArticleController.updateImage);
router.delete('/:id', ArticleController.delete);

module.exports = router;