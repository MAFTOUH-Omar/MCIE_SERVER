const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activity.controller');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "picture/activity/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage })

router.post('/' ,  upload.single('image') , ActivityController.create);
router.get('/', ActivityController.show);
router.get('/:id', ActivityController.showById);
router.put('/:id', ActivityController.update);
router.put('/:id/publish', ActivityController.publish);
router.put('/:id/hide', ActivityController.hide);
router.put('/:id/image' , upload.single('image') , ActivityController.updateImage);
router.delete('/:id', ActivityController.delete);

module.exports = router;