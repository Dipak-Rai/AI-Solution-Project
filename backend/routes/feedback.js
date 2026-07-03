const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Create feedback
router.post('/', async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.status(201).send(feedback);
});

// Get all feedback
router.get('/', async (req, res) => {
  const feedbacks = await Feedback.find();
  res.send(feedbacks);
});

// Update feedback
router.put('/:id', async (req, res) => {
  const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(feedback);
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

module.exports = router;