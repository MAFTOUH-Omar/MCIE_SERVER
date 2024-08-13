const Category = require('../models/category.model');

const CategoryController = {
    create: async (req, res) => {
        try {
            const { name, description } = req.body;

            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'الفئة موجودة بالفعل' });
            }

            const category = new Category({
                name,
                description
            });

            await category.save();
            res.status(201).json({ message: 'تم إنشاء الفئة بنجاح', category });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الفئة' });
        }
    },

    show: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الفئات' });
        }
    },

    showById: async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: 'الفئة غير موجودة' });
            }
            res.status(200).json(category);
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء عرض الفئة' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;

        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: 'الفئة غير موجودة' });
            }

            category.name = name || category.name;
            category.description = description || category.description;
            category.updated_at = Date.now();

            await category.save();
            res.status(200).json({ message: 'تم تحديث الفئة بنجاح', category });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء تحديث الفئة' });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: 'الفئة غير موجودة' });
            }

            await category.remove();
            res.status(200).json({ message: 'تم حذف الفئة بنجاح' });
        } catch (err) {
            res.status(500).json({ message: 'حدث خطأ أثناء حذف الفئة' });
        }
    }
};

module.exports = CategoryController;