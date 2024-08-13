const Dialog = require('../models/dialog.model');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');

const DialogController = {
    create: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const { title, content, author_id } = req.body;
                const image = req.file ? req.file.filename : null;

                const dialog = new Dialog({
                    title,
                    content,
                    image,
                    author_id
                });

                await dialog.save();
                res.status(201).json({ message: 'تم إنشاء الحوار بنجاح', dialog });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحوار' });
            }
        });
    },

    show: async (req, res) => {
        try {
            const dialogs = await Dialog.find();
            res.status(200).json(dialogs);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الحوارات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const dialog = await Dialog.findById(id);
            if (!dialog) {
                return res.status(404).json({ message: 'الحوار غير موجود' });
            }
            res.status(200).json(dialog);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الحوار' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, content, author_id, publish } = req.body;

        try {
            const dialog = await Dialog.findById(id);
            if (!dialog) {
                return res.status(404).json({ message: 'الحوار غير موجود' });
            }

            dialog.title = title || dialog.title;
            dialog.content = content || dialog.content;
            dialog.author_id = author_id || dialog.author_id;
            dialog.publish = publish !== undefined ? publish : dialog.publish;
            dialog.updated_at = Date.now();

            await dialog.save();
            res.status(200).json({ message: 'تم تحديث الحوار بنجاح', dialog });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحوار' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const dialog = await Dialog.findById(id);
            if (!dialog) {
                return res.status(404).json({ message: 'الحوار غير موجود' });
            }

            dialog.publish = true;
            dialog.updated_at = Date.now();

            await dialog.save();
            res.status(200).json({ message: 'تم نشر الحوار بنجاح', dialog });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر الحوار' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const dialog = await Dialog.findById(id);
            if (!dialog) {
                return res.status(404).json({ message: 'الحوار غير موجود' });
            }

            dialog.publish = false;
            dialog.updated_at = Date.now();

            await dialog.save();
            res.status(200).json({ message: 'تم إخفاء الحوار بنجاح', dialog });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء الحوار' });
        }
    },

    updateImage: async (req, res) => {
        const { id } = req.params;

        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const dialog = await Dialog.findById(id);
                if (!dialog) {
                    return res.status(404).json({ message: 'الحوار غير موجود' });
                }

                if (dialog.image && fs.existsSync(path.join(__dirname, '../picture/', dialog.image))) {
                    fs.unlinkSync(path.join(__dirname, '../picture/', dialog.image));
                }

                dialog.image = req.file ? req.file.filename : dialog.image;
                dialog.updated_at = Date.now();

                await dialog.save();
                res.status(200).json({ message: 'تم تحديث صورة الحوار بنجاح', dialog });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة الحوار' });
            }
        });
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const dialog = await Dialog.findById(id);
            if (!dialog) {
                return res.status(404).json({ message: 'الحوار غير موجود' });
            }

            if (dialog.image && fs.existsSync(path.join(__dirname, '../picture/', dialog.image))) {
                fs.unlinkSync(path.join(__dirname, '../picture/', dialog.image));
            }

            await dialog.remove();
            res.status(200).json({ message: 'تم حذف الحوار بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الحوار' });
        }
    }
};

module.exports = DialogController;