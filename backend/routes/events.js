const express = require('express');
const EventRegistration = require('../models/EventRegistration');

const router = express.Router();

router.post('/', async (req, res) => {
  const event = new EventRegistration(req.body);
  await event.save();
  res.status(201).send(event);
});

router.get('/', async (req, res) => {
  const events = await EventRegistration.find().sort({ createdAt: -1 });
  res.send(events);
});

router.put('/:id', async (req, res) => {
  const event = await EventRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) {
    return res.status(404).send({ message: 'Event registration not found' });
  }
  res.send(event);
});

router.delete('/:id', async (req, res) => {
  await EventRegistration.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

module.exports = router;
