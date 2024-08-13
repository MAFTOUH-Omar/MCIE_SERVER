const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publish : {type: Boolean , default: true} ,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;