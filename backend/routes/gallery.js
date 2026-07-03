const express = require('express');
const Gallery = require('../models/Gallery');

const router = express.Router();

router.post('/', async (req, res) => {
  const gallery = new Gallery(req.body);
  await gallery.save();
  res.status(201).send(gallery);
});

router.get('/', async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.send({ items });
});

router.put('/:id', async (req, res) => {
  const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!gallery) {
    return res.status(404).send({ message: 'Gallery item not found' });
  }
  res.send(gallery);
});

router.delete('/:id', async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

module.exports = router;
