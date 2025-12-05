const eventModel = require("../models/event.model");

module.exports.createEvent = async (req, res) => {
    const { startDateObj, endDateObj, profiles, timezone } = req.body;
    try {
        const event = await eventModel.create({
            startDateObj,
            endDateObj,
            timezone,
            profiles
        })

        res.status(201).json({ message: "event created succesfully", data: event })
    } catch (err) {
        return res.status(400).json({ message: "error while creating event", error: err.array() })
    }
}
