const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
    filter_type: { type: String, required: true, enum: ['date', 'category'] },
    value: { type: String, required: true },
    applied_at: { type: Date, default: Date.now }
});

const Filter = mongoose.model('Filter', filterSchema);

module.exports = Filter;