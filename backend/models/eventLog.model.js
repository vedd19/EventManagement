const mongoose = require('mongoose')

const eventLogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
        required: true
    },
    action: {
        type: String,
        enum: ["created", "updated", "deleted"],
        required: true
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profiles",
        required: true
    },
    changes: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    newVersion: {
        type: Number,
        default: 1
    },
    message: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const eventLogModel = mongoose.model('EventLogs', eventLogSchema);

module.exports = eventLogModel;
