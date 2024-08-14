const Publication = require('../models/publication.model');
const path = require('path');
const fs = require('fs');

const PublicationController = {
    create: async (req, res) => {
        try {
            const { title, content, author_id } = req.body;
            const image = req.file ? req.file.filename : null;

            const publication = new Publication({
                title,
                content,
                author_id
            });

            if (image) {
                publication.image = `picture/publication/${image}`;
            }

            await publication.save();
            res.status(201).json({ message: 'تم إنشاء النشر بنجاح', publication });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء النشر', err });
        }
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
        try {
            const image = req.file ? req.file.filename : null;
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            if (publication.image) {
                const oldImagePath = path.join(__dirname, '..', 'picture/publication', path.basename(publication.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            if (image) {
                publication.image = `picture/publication/${image}`;
            }

            publication.updated_at = Date.now();
            await publication.save();
            res.status(200).json({ message: 'تم تحديث صورة النشر بنجاح', publication });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث صورة النشر' });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const publication = await Publication.findById(id);
            if (!publication) {
                return res.status(404).json({ message: 'النشر غير موجود' });
            }

            const imagePath = publication.image ? path.join(__dirname, '..', 'picture/publication', path.basename(publication.image)) : null;

            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await Publication.findByIdAndDelete(id);

            res.status(200).json({ message: 'تم حذف النشر بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف النشر' });
        }
    }
};

module.exports = PublicationController;