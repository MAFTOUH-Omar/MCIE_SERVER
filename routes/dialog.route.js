const express = require('express');
const router = express.Router();
const DialogController = require('../controllers/dialog.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/dialog/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') , DialogController.create);
router.get('/', DialogController.show);
router.get('/:id', DialogController.showById);
router.put('/:id', DialogController.update);
router.put('/:id/publish', DialogController.publish);
router.put('/:id/hide', DialogController.hide);
router.put('/:id/image' ,  upload.single('image') , DialogController.updateImage);
router.delete('/:id', DialogController.delete);

module.exports = router;