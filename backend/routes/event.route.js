const express = require('express')
const router = express.Router();
const eventController = require('../controllers/event.controller')

router.post('/create-event', eventController.createEvent);
router.get('/get-events', eventController.getEvents);
router.put('/update-event', eventController.updateEvent);
router.delete('/delete-event/:eventId', eventController.deleteEvent);
router.get('/get-event-logs/:eventId', eventController.getEventLogs);

module.exports = router