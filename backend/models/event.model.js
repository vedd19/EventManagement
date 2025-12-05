const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    profiles: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profiles",
        }],
        default: [],
        required: true
    },

    timezone: {
        type: String,
        required: true
    },

    startDateObj: {
        type: Date,
        required: true
    },
    endDateObj: {
        type: Date,
        required: true
    }

}, { timestamps: true });

const eventModel = mongoose.model('Events', eventSchema);

module.exports = eventModel;