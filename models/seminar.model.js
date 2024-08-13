const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Seminar = mongoose.model('Seminar', seminarSchema);

module.exports = Seminar;