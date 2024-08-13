const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    publish : {type: Boolean , default: true} ,
    activity_type: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;