const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publish : {type: Boolean , default: true} ,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;