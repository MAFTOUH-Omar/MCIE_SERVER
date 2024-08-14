const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/publication/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') , PublicationController.create);
router.get('/', PublicationController.show);
router.get('/:id', PublicationController.showById);
router.put('/:id', PublicationController.update);
router.patch('/:id/publish', PublicationController.publish);
router.patch('/:id/hide', PublicationController.hide);
router.patch('/:id/image' ,  upload.single('image') , PublicationController.updateImage);
router.delete('/:id', PublicationController.delete);

module.exports = router;