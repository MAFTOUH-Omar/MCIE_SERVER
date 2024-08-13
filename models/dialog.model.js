const mongoose = require('mongoose');

const dialogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publish : {type: Boolean , default: true} ,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Dialog = mongoose.model('Dialog', dialogSchema);

module.exports = Dialog;