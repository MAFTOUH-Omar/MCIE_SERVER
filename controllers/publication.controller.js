const Publication = require('../models/publication.model');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');

const PublicationController = {
    create: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const { title, content, author_id } = req.body;
                const image = req.file ? req.file.filename : null;

                const publication = new Publication({
                    title,
                    content,
                    image,
                    author_id
                });

                await publication.save();
                res.status(201).json({ message: 'تم إنشاء النشر بنجاح', publication });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء إنشاء النشر' });
            }
        });
    },

    show: async (req, res) => {
        try {
            const publications = await Publication.find();
            res.status(200).json(publications);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض المنشورات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }
            res.status(200).json(publication);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض النشر' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, content, author_id, publish } = req.body;

        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            publication.title = title || publication.title;
            publication.content = content || publication.content;
            publication.author_id = author_id || publication.author_id;
            publication.publish = publish !== undefined ? publish : publication.publish;
            publication.updated_at = Date.now();

            await publication.save();
            res.status(200).json({ message: 'تم تحديث النشر بنجاح', publication });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث النشر' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            publication.publish = true;
            publication.updated_at = Date.now();

            await publication.save();
            res.status(200).json({ message: 'تم نشر النشر بنجاح', publication });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر النشر' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            publication.publish = false;
            publication.updated_at = Date.now();

            await publication.save();
            res.status(200).json({ message: 'تم إخفاء النشر بنجاح', publication });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء النشر' });
        }
    },

    updateImage: async (req, res) => {
        const { id } = req.params;

        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            }

            try {
                const publication = await Publication.findById(id);
                if (!publication) {
                    return res.status(404).json({ message: 'النشر غير موجود' });
                }

                if (publication.image && fs.existsSync(path.join(__dirname, '../picture/', publication.image))) {
                    fs.unlinkSync(path.join(__dirname, '../picture/', publication.image));
                }

                publication.image = req.file ? req.file.filename : publication.image;
                publication.updated_at = Date.now();

                await publication.save();
                res.status(200).json({ message: 'تم تحديث صورة النشر بنجاح', publication });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة النشر' });
            }
        });
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            if (publication.image && fs.existsSync(path.join(__dirname, '../picture/', publication.image))) {
                fs.unlinkSync(path.join(__dirname, '../picture/', publication.image));
            }

            await publication.remove();
            res.status(200).json({ message: 'تم حذف النشر بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف النشر' });
        }
    }
};

module.exports = PublicationController;