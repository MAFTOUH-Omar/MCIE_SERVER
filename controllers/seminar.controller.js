const Seminar = require('../models/seminar.model');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');

const SeminarController = {
    create: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const { title, description, date, location } = req.body;
                const image = req.file ? req.file.filename : null;

                const seminar = new Seminar({
                    title,
                    description,
                    image,
                    date,
                    location
                });

                await seminar.save();
                res.status(201).json({ message: 'تم إنشاء الندوة بنجاح', seminar });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الندوة' });
            }
        });
    },

    show: async (req, res) => {
        try {
            const seminars = await Seminar.find();
            res.status(200).json(seminars);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الندوات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }
            res.status(200).json(seminar);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الندوة' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, description, date, location, publish } = req.body;

        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            seminar.title = title || seminar.title;
            seminar.description = description || seminar.description;
            seminar.date = date || seminar.date;
            seminar.location = location || seminar.location;
            seminar.publish = publish !== undefined ? publish : seminar.publish;
            seminar.updated_at = Date.now();

            await seminar.save();
            res.status(200).json({ message: 'تم تحديث الندوة بنجاح', seminar });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الندوة' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            seminar.publish = true;
            seminar.updated_at = Date.now();

            await seminar.save();
            res.status(200).json({ message: 'تم نشر الندوة بنجاح', seminar });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر الندوة' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            seminar.publish = false;
            seminar.updated_at = Date.now();

            await seminar.save();
            res.status(200).json({ message: 'تم إخفاء الندوة بنجاح', seminar });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء الندوة' });
        }
    },

    updateImage: async (req, res) => {
        const { id } = req.params;

        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const seminar = await Seminar.findById(id);
                if (!seminar) {
                    return res.status(404).json({ message: 'الندوة غير موجودة' });
                }

                if (seminar.image && fs.existsSync(path.join(__dirname, '../publication/', seminar.image))) {
                    fs.unlinkSync(path.join(__dirname, '../publication', seminar.image));
                }

                seminar.image = req.file ? req.file.filename : seminar.image;
                seminar.updated_at = Date.now();

                await seminar.save();
                res.status(200).json({ message: 'تم تحديث صورة الندوة بنجاح', seminar });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة الندوة' });
            }
        });
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            if (seminar.image && fs.existsSync(path.join(__dirname, '../publication/', seminar.image))) {
                fs.unlinkSync(path.join(__dirname, '../publication/', seminar.image));
            }

            await seminar.remove();
            res.status(200).json({ message: 'تم حذف الندوة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الندوة' });
        }
    }
};

module.exports = SeminarController;