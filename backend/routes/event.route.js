const express = require('express')
const router = express.Router();
const eventController = require('../controllers/event.controller')

router.post('/create-event', eventController.createEvent);

module.exports = router