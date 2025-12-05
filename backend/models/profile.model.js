const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    events: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Events",
        }],
        default: []
    }
});

const profileModel = mongoose.model('Profiles', profileSchema);

module.exports = profileModel;