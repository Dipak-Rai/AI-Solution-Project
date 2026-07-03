const express = require('express');
const Article = require('../models/Article');
const auth = require('../middleware/auth');

const router = express.Router();

/*
CREATE ARTICLE
*/
router.post('/', auth, async (req, res) => {
  try {
    const article = new Article(req.body);

    await article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create article',
      error: error.message,
    });
  }
});

/*
GET ALL ARTICLES
*/
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
});

/*
UPDATE ARTICLE
*/
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return res.status(404).json({
        message: 'Article not found',
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({
      message: 'Update failed',
      error: error.message,
    });
  }
});

/*
DELETE ARTICLE
*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        message: 'Article not found',
      });
    }

    res.status(200).json({
      message: 'Deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Delete failed',
      error: error.message,
    });
  }
});

module.exports = router;