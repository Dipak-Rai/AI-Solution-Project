const express = require('express');
const Gallery = require('../models/Gallery');

const router = express.Router();
const MAX_IMAGE_URL_LENGTH = 500000;

const sanitizeGalleryItem = (gallery, includeImage = false) => {
  const safeItem = { ...gallery };
  if (!includeImage) {
    delete safeItem.imageUrl;
  }
  if (includeImage && typeof safeItem.imageUrl === 'string' && safeItem.imageUrl.length > MAX_IMAGE_URL_LENGTH) {
    console.warn('Dropping oversized gallery imageUrl for item', safeItem._id || safeItem.id);
    safeItem.imageUrl = '';
    safeItem.imageTooLarge = true;
  }
  return safeItem;
};

// Create gallery item
router.post('/', async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).send(sanitizeGalleryItem(gallery.toObject ? gallery.toObject() : gallery, true));
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).send({ error: 'Failed to create gallery item' });
  }
});

// Get all gallery
router.get('/', async (req, res) => {
  const full = req.query.full === 'true';
  const preview = req.query.preview === 'true';
  const includeImage = full;
  console.log('GET /api/gallery called', { full, preview, query: req.query });
  try {
    const queryStart = Date.now();
    const projection = includeImage ? {} : { imageUrl: 0 };
    const galleries = await Gallery.find({}, projection).lean().maxTimeMS(10000).exec();
    console.log('Gallery query finished in', Date.now() - queryStart, 'ms, count', galleries.length, 'includeImage', includeImage);

    const mapStart = Date.now();
    const safeGalleries = galleries.map((gallery) => sanitizeGalleryItem(gallery, includeImage));
    console.log('Gallery map finished in', Date.now() - mapStart, 'ms');

    res.json(safeGalleries);
    console.log('Gallery response sent, items', safeGalleries.length);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// Update gallery
router.put('/:id', async (req, res) => {
  const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(gallery);
});

// Delete gallery
router.delete('/:id', async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

module.exports = router;