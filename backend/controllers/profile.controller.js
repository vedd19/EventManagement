const profileModel = require("../models/profile.model");

module.exports.addProfile = async (req, res) => {

    const { profileName } = req.body;
    try {
        const profile = await profileModel.create({
            name: profileName
        })
        res.status(201).json({ message: "profile created succesfully", data: profile })
    }
    catch (err) {
        return res.status(400).json({ message: "error while adding profile", error: err })
    }
}
module.exports.getProfiles = async (req, res) => {

    try {
        const profiles = await profileModel.find()
        res.status(200).json({ data: profiles })
    }
    catch (err) {
        return res.status(400).json({ message: "error while adding profile", error: err })
    }
}