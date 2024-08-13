const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    related_resources: [{ type: String }],
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Study = mongoose.model('Study', studySchema);

module.exports = Study;