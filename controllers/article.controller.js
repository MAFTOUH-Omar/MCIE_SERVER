const fs = require('fs');
const path = require('path');
const Article = require('../models/article.model');
const upload = require('../config/multerConfig'); 

const ArticleController = {
    create: async (req, res) => {
        const { title, image, category_id, content, author_id } = req.body;

        try {
            const newArticle = new Article({
                title,
                image,
                category_id,
                content,
                author_id,
            });

            await newArticle.save();
            res.status(201).json({ message: 'تم إنشاء المقالة بنجاح', article: newArticle });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المقالة' });
        }
    },

    show: async (req, res) => {
        try {
            const articles = await Article.find().populate('category_id').populate('author_id');
            res.status(200).json({ message: 'تم استرجاع المقالات بنجاح', articles });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء استرجاع المقالات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;

        try {
            const article = await Article.findById(id).populate('category_id').populate('author_id');

            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }

            res.status(200).json({ message: 'تم استرجاع المقالة بنجاح', article });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء استرجاع المقالة' });
        }
    },

    publish: async (req, res) => {
        const { id } = req.params;

        try {
            const article = await Article.findByIdAndUpdate(
                id,
                { publish: true },
                { new: true }
            );

            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }

            res.status(200).json({ message: 'تم نشر المقالة بنجاح', article });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء نشر المقالة' });
        }
    },

    hide: async (req, res) => {
        const { id } = req.params;

        try {
            const article = await Article.findByIdAndUpdate(
                id,
                { publish: false },
                { new: true }
            );

            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }

            res.status(200).json({ message: 'تم إخفاء المقالة بنجاح', article });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إخفاء المقالة' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title, image, category_id, content } = req.body;

        try {
            const article = await Article.findByIdAndUpdate(
                id,
                { title, image, category_id, content, updated_at: Date.now() },
                { new: true }
            );

            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }

            res.status(200).json({ message: 'تم تحديث المقالة بنجاح', article });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث المقالة' });
        }
    } ,

    updateImage: async (req, res) => {
        const { id } = req.params;

        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: 'حدث خطأ أثناء تحميل الصورة' });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }

            try {
                const article = await Article.findById(id);
                if (!article) {
                    return res.status(404).json({ message: 'المقالة غير موجودة' });
                }

                if (article.image) {
                    const oldImagePath = path.join(__dirname, '..', article.image);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Erreur lors de la suppression de l\'ancienne image:', err);
                    });
                }

                article.image = req.file.path;
                await article.save();

                res.status(200).json({ message: 'تم تحديث الصورة بنجاح', article });
            } catch (err) {
                res.status(500).json({ message: 'حدث خطأ أثناء تحديث الصورة' });
            }
        });
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const article = await Article.findById(id);
            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }

            if (article.image) {
                const imagePath = path.join(__dirname, '..', article.image);
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Erreur lors de la suppression de l\'image:', err);
                });
            }

            await article.remove();

            res.status(200).json({ message: 'تم حذف المقالة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف المقالة' });
        }
    },
};

module.exports = ArticleController;