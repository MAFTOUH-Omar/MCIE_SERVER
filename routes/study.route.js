const express = require('express');
const router = express.Router();
const StudyController = require('../controllers/study.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/study/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') ,StudyController.create);
router.get('/', StudyController.show);
router.get('/:id', StudyController.showById);
router.put('/:id/update', StudyController.update);
router.put('/:id/publish', StudyController.publish);
router.put('/:id/hide', StudyController.hide);
router.put('/:id/image' ,  upload.single('image') ,StudyController.updateImage);
router.delete('/:id', StudyController.delete);

module.exports = router;