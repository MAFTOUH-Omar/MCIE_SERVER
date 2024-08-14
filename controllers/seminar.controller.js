const Seminar = require('../models/seminar.model');
const path = require('path');
const fs = require('fs');

const SeminarController = {
    create: async (req, res) => {
        try {
            const { title, description, date, location } = req.body;
            const image = req.file ? req.file.filename : null;

            const seminar = new Seminar({
                title,
                description,
                date,
                location,
            });

            if (image) {
                seminar.image = `picture/seminar/${image}`;
            }

            await seminar.save();
            res.status(201).json({ message: 'تم إنشاء الندوة بنجاح', seminar });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الندوة', err });
        }
    },

    show: async (req, res) => {
        try {
            const seminars = await Seminar.find();
            res.status(200).json(seminars);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الندوات', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الندوة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الندوة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء نشر الندوة', err });
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
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء الندوة', err });
        }
    },

    updateImage: async (req, res) => {
        try {
            const { id } = req.params;
            const image = req.file ? req.file.filename : null;

            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            if (seminar.image) {
                const oldImagePath = path.join(__dirname, '..', 'picture/seminar', path.basename(seminar.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            if (image) {
                seminar.image = `picture/seminar/${image}`;
            } else {
                seminar.image = "";
            }

            seminar.updated_at = Date.now();
            await seminar.save();
            res.status(200).json({ message: 'تم تحديث صورة الندوة بنجاح', seminar });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة الندوة', err });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const seminar = await Seminar.findById(id);
            if (!seminar) {
                return res.status(404).json({ message: 'الندوة غير موجودة' });
            }

            const imagePath = seminar.image ? path.join(__dirname, '..', 'picture/seminar', path.basename(seminar.image)) : null;

            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await Seminar.findByIdAndDelete(id);

            res.status(200).json({ message: 'تم حذف الندوة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الندوة', err });
        }
    }    
};

module.exports = SeminarController;