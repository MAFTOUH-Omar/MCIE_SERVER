const Study = require('../models/study.model');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');

const StudyController = {
    create: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const { title, description, related_resources, author_id } = req.body;
                const image = req.file ? req.file.filename : null;

                const study = new Study({
                    title,
                    description,
                    image,
                    related_resources: JSON.parse(related_resources),
                    author_id
                });

                await study.save();
                res.status(201).json({ message: 'تم إنشاء الدراسة بنجاح', study });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الدراسة' });
            }
        });
    },

    show: async (req, res) => {
        try {
            const studies = await Study.find();
            res.status(200).json(studies);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الدراسات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }
            res.status(200).json(study);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الدراسة' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, description, related_resources, author_id, publish } = req.body;

        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            study.title = title || study.title;
            study.description = description || study.description;
            study.related_resources = related_resources ? JSON.parse(related_resources) : study.related_resources;
            study.author_id = author_id || study.author_id;
            study.publish = publish !== undefined ? publish : study.publish;
            study.updated_at = Date.now();

            await study.save();
            res.status(200).json({ message: 'تم تحديث الدراسة بنجاح', study });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الدراسة' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            study.publish = true;
            study.updated_at = Date.now();

            await study.save();
            res.status(200).json({ message: 'تم نشر الدراسة بنجاح', study });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر الدراسة' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            study.publish = false;
            study.updated_at = Date.now();

            await study.save();
            res.status(200).json({ message: 'تم إخفاء الدراسة بنجاح', study });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء الدراسة' });
        }
    },

    updateImage: async (req, res) => {
        const { id } = req.params;

        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const study = await Study.findById(id);
                if (!study) {
                    return res.status(404).json({ message: 'الدراسة غير موجودة' });
                }

                if (study.image && fs.existsSync(path.join(__dirname, '../publication/', study.image))) {
                    fs.unlinkSync(path.join(__dirname, '../publication/', study.image));
                }

                study.image = req.file ? req.file.filename : study.image;
                study.updated_at = Date.now();

                await study.save();
                res.status(200).json({ message: 'تم تحديث صورة الدراسة بنجاح', study });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة الدراسة' });
            }
        });
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            if (study.image && fs.existsSync(path.join(__dirname, '../publication/', study.image))) {
                fs.unlinkSync(path.join(__dirname, '../publication/', study.image));
            }

            await study.remove();
            res.status(200).json({ message: 'تم حذف الدراسة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الدراسة' });
        }
    }
};

module.exports = StudyController;