const Activity = require('../models/activity.model');
const path = require('path');
const fs = require('fs');

const ActivityController = {
    create: async (req, res) => {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const { title, description, activity_type } = req.body;
                const image = req.file ? req.file.filename : null;

                const activity = new Activity({
                    title,
                    description,
                    image,
                    activity_type
                });

                await activity.save();
                res.status(201).json({ message: 'تم إنشاء النشاط بنجاح', activity });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء إنشاء النشاط' });
            }
        });
    },

    show: async (req, res) => {
        try {
            const activities = await Activity.find();
            res.status(200).json(activities);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الأنشطة' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }
            res.status(200).json(activity);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض النشاط' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, description, activity_type, publish } = req.body;

        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }

            activity.title = title || activity.title;
            activity.description = description || activity.description;
            activity.activity_type = activity_type || activity.activity_type;
            activity.publish = publish !== undefined ? publish : activity.publish;
            activity.updated_at = Date.now();

            await activity.save();
            res.status(200).json({ message: 'تم تحديث النشاط بنجاح', activity });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث النشاط' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }

            activity.publish = true;
            activity.updated_at = Date.now();

            await activity.save();
            res.status(200).json({ message: 'تم نشر النشاط بنجاح', activity });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر النشاط' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }

            activity.publish = false;
            activity.updated_at = Date.now();

            await activity.save();
            res.status(200).json({ message: 'تم إخفاء النشاط بنجاح', activity });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء النشاط' });
        }
    },

    updateImage: async (req, res) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }

            if (activity.image && fs.existsSync(path.join(__dirname, '../pictures/', activity.image))) {
                fs.unlinkSync(path.join(__dirname, '../pictures/', activity.image));
            }

            activity.image = req.file ? req.file.filename : activity.image;
            activity.updated_at = Date.now();

            await activity.save();
            res.status(200).json({ message: 'تم تحديث صورة النشاط بنجاح', activity });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة النشاط' });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }

            if (activity.image && fs.existsSync(path.join(__dirname, '../pictures/', activity.image))) {
                fs.unlinkSync(path.join(__dirname, '../pictures/', activity.image));
            }

            await activity.remove();
            res.status(200).json({ message: 'تم حذف النشاط بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف النشاط' });
        }
    }
};

module.exports = ActivityController;