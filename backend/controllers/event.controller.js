const eventModel = require("../models/event.model");
const eventLogModel = require("../models/eventLog.model");
const profileModel = require("../models/profile.model");

const generateChangeMessage = async (changes, action) => {
    const messages = [];

    if (action === "created") {
        messages.push("Event created");
    } else if (action === "updated") {
        if (!changes || Object.keys(changes).length === 0) {
            return "No changes recorded";
        }

        if (changes.startDateObj) {
            const oldDate = new Date(changes.startDateObj.old).toLocaleDateString();
            const newDate = new Date(changes.startDateObj.new).toLocaleDateString();
            messages.push(`Start date/time updated from ${oldDate} to ${newDate}`);
        }
        if (changes.endDateObj) {
            const oldDate = new Date(changes.endDateObj.old).toLocaleDateString();
            const newDate = new Date(changes.endDateObj.new).toLocaleDateString();
            messages.push(`End date/time updated from ${oldDate} to ${newDate}`);
        }

        if (changes.timezone) {
            messages.push(`Timezone updated from ${changes.timezone.old} to ${changes.timezone.new}`);
        }
        if (changes.profiles) {
            const normalize = (p) => {
                if (!p) return null;
                if (typeof p === "string") return p;
                return p._id?.toString();
            };

            const oldProfileIds = changes.profiles.old.map(normalize).filter(Boolean);
            const newProfileIds = changes.profiles.new.map(normalize).filter(Boolean);

            const removedIds = oldProfileIds.filter(id => !newProfileIds.includes(id));
            const addedIds = newProfileIds.filter(id => !oldProfileIds.includes(id));

            if (removedIds.length > 0) {
                const removedProfiles = await profileModel.find({ _id: { $in: removedIds } });
                const names = removedProfiles.map(p => p.name).join(", ");
                messages.push(`Removed users: ${names}`);
            }

            if (addedIds.length > 0) {
                const addedProfiles = await profileModel.find({ _id: { $in: addedIds } });
                const names = addedProfiles.map(p => p.name).join(", ");
                messages.push(`User added: ${names}`);
            }
        }

    }

    return messages.length > 0 ? messages.join("; ") : "No changes recorded";
};

module.exports.createEvent = async (req, res) => {
    const { startDateObj, endDateObj, profiles, timezone, creator } = req.body;

    try {
        if (!creator) {
            return res.status(400).json({ message: "creator is required" })
        }
        if (!startDateObj || !endDateObj) {
            return res.status(400).json({ message: "start date n time & end date n time are required" })
        }

        if (!timezone) {
            return res.status(400).json({ message: "timezone is required" })
        }

        if (!profiles || profiles.length === 0) {
            return res.status(400).json({ message: "at least one profile is required" })
        }

        const creatorProfile = await profileModel.findById(creator)
        if (!creatorProfile) {
            return res.status(400).json({ message: "creator profile does not exist" })
        }

        const event = await eventModel.create({
            startDateObj: new Date(startDateObj),
            endDateObj: new Date(endDateObj),
            timezone,
            profiles,
            creator
        })


        const creationMessage = await generateChangeMessage({
            startDateObj: event.startDateObj,
            endDateObj: event.endDateObj,
            timezone: event.timezone,
            profiles: event.profiles
        }, "created");

        await eventLogModel.create({
            eventId: event._id,
            action: "created",
            changedBy: creator,
            changes: {
                startDateObj: event.startDateObj,
                endDateObj: event.endDateObj,
                timezone: event.timezone,
                profiles: event.profiles
            },
            message: creationMessage
        })

        res.status(201).json({ message: "event created successfully", data: event })
    } catch (err) {
        return res.status(400).json({ message: "error while creating event", error: err.message })
    }
}

module.exports.getEvents = async (req, res) => {
    try {
        const events = await eventModel.find().populate('profiles creator')
        res.status(200).json({ message: "events retrieved successfully", data: events })
    } catch (err) {
        return res.status(400).json({ message: "error while retrieving events", error: err.message })
    }
}

module.exports.updateEvent = async (req, res) => {
    const { eventId, startDateObj, endDateObj, profiles, timezone, updatedBy } = req.body;
    try {
        if (!eventId) {
            return res.status(400).json({ message: "eventId is required" })
        }
        if (!startDateObj || !endDateObj) {
            return res.status(400).json({ message: "startDateTime and endDateTime are required" })
        }
        if (!timezone) {
            return res.status(400).json({ message: "timezone is required" })
        }
        if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
            return res.status(400).json({ message: "at least one profile is required" })
        }
        if (!updatedBy) {
            return res.status(400).json({ message: "updatedBy is required" })
        }

        const profileIds = profiles.map(p => typeof p === 'string' ? p : p._id);
        const existingProfiles = await profileModel.find({ _id: { $in: profileIds } });
        if (existingProfiles.length !== profileIds.length) {
            return res.status(400).json({ message: "one or more profiles do not exist" })
        }

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "event not found" })
        }


        const newStartDate = new Date(startDateObj);
        const newEndDate = new Date(endDateObj);

        const changes = {};
        if (newStartDate.getTime() !== event.startDateObj.getTime()) {
            changes.startDateObj = { old: event.startDateObj, new: newStartDate }
        }
        if (newEndDate.getTime() !== event.endDateObj.getTime()) {
            changes.endDateObj = { old: event.endDateObj, new: newEndDate }
        }
        if (timezone && timezone !== event.timezone) {
            changes.timezone = { old: event.timezone, new: timezone }
        }
        if (profiles && JSON.stringify(profiles.sort()) !== JSON.stringify(event.profiles.map(p => typeof p === 'string' ? p : p._id).sort())) {
            changes.profiles = { old: event.profiles, new: profiles }
        }
        const newVersion = event.version + 1;
        const updatedEvent = await eventModel.findByIdAndUpdate(
            eventId,
            {
                startDateObj: newStartDate,
                endDateObj: newEndDate,
                timezone: timezone,
                profiles: profiles,
                version: newVersion
            },
            { new: true, runValidators: true }
        );


        const changeMessage = await generateChangeMessage(changes, "updated");


        await eventLogModel.create({
            eventId: eventId,
            action: "updated",
            changedBy: updatedBy,
            changes: changes,
            newVersion: newVersion,
            message: changeMessage
        })

        res.status(200).json({ message: "event updated successfully", data: updatedEvent })
    } catch (err) {
        console.error("Update Event Error:", err);
        return res.status(400).json({ message: "error while updating event", error: err.message })
    }
}

module.exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        await eventModel.findByIdAndDelete(eventId);
        res.status(200).json({ message: "event deleted successfully" })
    } catch (err) {
        return res.status(400).json({ message: "error while deleting event", error: err.message })
    }
}

module.exports.getEventLogs = async (req, res) => {
    const { eventId } = req.params;
    try {
        const logs = await eventLogModel.find({ eventId }).populate('changedBy').sort({ createdAt: -1 });
        res.status(200).json({ message: "event logs retrieved successfully", data: logs })
    } catch (err) {
        return res.status(400).json({ message: "error while retrieving event logs", error: err.message })
    }
}
