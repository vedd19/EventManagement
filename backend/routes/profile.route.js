const express = require('express')
const router = express.Router();
const profileControler = require('../controllers/profile.controller')

router.post('/add-profile', profileControler.addProfile);
router.get('/get-profiles', profileControler.getProfiles);

module.exports = router