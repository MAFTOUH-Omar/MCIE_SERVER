const express = require('express');
const router = express.Router();
const SeminarController = require('../controllers/seminar.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/seminar/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') ,SeminarController.create);
router.get('/', SeminarController.show);
router.get('/:id', SeminarController.showById);
router.put('/:id', SeminarController.update);
router.put('/:id/publish', SeminarController.publish);
router.put('/:id/hide', SeminarController.hide);
router.put('/:id/image' ,  upload.single('image') ,SeminarController.updateImage);
router.delete('/:id', SeminarController.delete);

module.exports = router;