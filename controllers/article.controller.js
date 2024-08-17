const fs = require('fs');
const path = require('path');
const Article = require('../models/article.model');

const ArticleController = {
    create: async (req, res) => {
        try {
            const { title , category_id , content , author_id } = req.body;
            const image = req.file ? req.file.filename : null;
            const newArticle = new Article({
                title,
                category_id,
                content,
                author_id,
            });

            if (image) {
                newArticle.image = `picture/article/${image}`;
            }

            await newArticle.save();
            res.status(201).json({ message: 'تم إنشاء المقالة بنجاح', article: newArticle });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المقالة' , err});
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
            
            const articles = await Article.find().populate('category_id').populate('author_id').sort(sortOptions);
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
        try {
            const { id } = req.params;
            const newImage = req.file ? req.file.filename : null;
    
            const article = await Article.findById(id);
            
            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }
    
            if (article.image) {
                const oldImagePath = path.join(__dirname, '..', 'picture/article', path.basename(article.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
    
            if (newImage) {
                article.image = `picture/article/${newImage}`;
            } else {
                article.image = "";
            }
    
            await article.save();
            res.status(200).json({ message: 'تم تحديث الصورة بنجاح', article });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الصورة' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
    
            const article = await Article.findById(id);
    
            if (!article) {
                return res.status(404).json({ message: 'المقالة غير موجودة' });
            }
    
            const imagePath = article.image ? path.join(__dirname, '..', 'picture/article', path.basename(article.image)) : null;
    
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
    
            await Article.findByIdAndDelete(id);
    
            res.status(200).json({ message: 'تم حذف المقالة بنجاح' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'حدث خطأ أثناء حذف المقالة' });
        }
    },
};

module.exports = ArticleController;