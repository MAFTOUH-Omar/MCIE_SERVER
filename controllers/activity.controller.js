const Activity = require('../models/activity.model');
const fs = require('fs');
const path = require('path');

const ActivityController = {
    create: async (req, res) => {
        try {
            const { title, description, activity_type } = req.body;
            const image = req.file ? req.file.filename : null;

            const activity = new Activity({
                title,
                description,
                activity_type
            });

            if (image) {
                activity.image = `picture/activity/${image}`;
            }

            await activity.save();

            res.status(201).json({ message: 'تم إنشاء النشاط بنجاح', activity });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء النشاط' , err});
        }
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
        try {
            const { id } = req.params;
            const image = req.file ? req.file.filename : null;
    
            const activity = await Activity.findById(id);
            if (!activity) {
                return res.status(404).json({ message: 'النشاط غير موجود' });
            }
    
            if (image) {
                activity.image = `picture/activity/${image}`;
            }
    
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
    
            const imagePath = activity.image ? path.join(__dirname, '..', 'pictures/activity', path.basename(activity.image)) : null;
    
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
    
            await Activity.findByIdAndDelete(id);
    
            res.status(200).json({ message: 'تم حذف النشاط بنجاح' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'حدث خطأ أثناء حذف النشاط' });
        }
    }
};

module.exports = ActivityController;