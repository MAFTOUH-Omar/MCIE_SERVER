const Study = require('../models/study.model');
const path = require('path');
const fs = require('fs');

const StudyController = {
    create: async (req, res) => {
        try {
            const { title, description, related_resources, author_id } = req.body;
            const image = req.file ? req.file.filename : null;

            const study = new Study({
                title,
                description,
                related_resources: related_resources,
                author_id
            });

            if (image) {
                study.image = `picture/study/${image}`;
            }

            await study.save();
            res.status(201).json({ message: 'تم إنشاء الدراسة بنجاح', study });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الدراسة', err });
        }
    },

    show: async (req, res) => {
        try {
            const { sort = 'recent' } = req.query;
    
            let sortOptions = { created_at: -1 };
            if (sort === 'recent') {
                sortOptions = { created_at: -1 };
            } else if (sort === 'older') {
                sortOptions = { created_at: 1 };
            }
    
            const studies = await Study.find().sort(sortOptions);
            res.status(200).json(studies);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الدراسات', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الدراسة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الدراسة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء نشر الدراسة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء الدراسة', err });
        }
    },

    updateImage: async (req, res) => {
        try {
            const { id } = req.params;
            const image = req.file ? req.file.filename : null;

            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            if (study.image) {
                const oldImagePath = path.join(__dirname, '..', 'picture/study/', path.basename(study.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            if (image) {
                study.image = `picture/study/${image}`;
            } else {
                study.image = "";
            }

            study.updated_at = Date.now();
            await study.save();
            res.status(200).json({ message: 'تم تحديث صورة الدراسة بنجاح', study });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة الدراسة', err });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const study = await Study.findById(id);
            if (!study) {
                return res.status(404).json({ message: 'الدراسة غير موجودة' });
            }

            const imagePath = study.image ? path.join(__dirname, '..', 'picture/study/', path.basename(study.image)) : null;

            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await Study.findByIdAndDelete(id);
            res.status(200).json({ message: 'تم حذف الدراسة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الدراسة', err });
        }
    }
};

module.exports = StudyController;