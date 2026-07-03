const express = require('express');
const Demo = require('../models/Demo');

const router = express.Router();

router.post('/', async (req, res) => {
  const demo = new Demo(req.body);
  await demo.save();
  res.status(201).send(demo);
});

router.get('/', async (req, res) => {
  const demos = await Demo.find().sort({ createdAt: -1 });
  res.send(demos);
});

router.put('/:id', async (req, res) => {
  const demo = await Demo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!demo) {
    return res.status(404).send({ message: 'Demo item not found' });
  }
  res.send(demo);
});

router.delete('/:id', async (req, res) => {
  await Demo.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

module.exports = router;
