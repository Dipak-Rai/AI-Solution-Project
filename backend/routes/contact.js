const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

/*
=================================
Validation Rules
=================================
*/

const validateContact = [
  body('fullName')
    .trim()
    .isString()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Invalid full name'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email'),

  body('phone')
    .trim()
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage('Invalid phone number'),

  body('company')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 }),

  body('country')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }),

  body('jobTitle')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 }),

  body('jobDetails')
    .trim()
    .escape()
    .isLength({ min: 2, max: 500 }),
];

/*
=================================
Create Contact
=================================
*/

router.post('/', validateContact, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation Failed',
      errors: errors.array(),
    });
  }

  try {

    const contact = new Contact(req.body);

    await contact.save();

    res.status(201).json(contact);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

/*
=================================
Get Contacts
=================================
*/

router.get('/', async (req, res) => {

  try {

    const contacts = await Contact.find();

    res.json(contacts);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

/*
=================================
Update Contact
=================================
*/

router.put('/:id', validateContact, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({
      message: 'Validation Failed',
      errors: errors.array(),
    });

  }

  try {

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(contact);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

/*
=================================
Delete Contact
=================================
*/

router.delete('/:id', async (req, res) => {

  try {

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Deleted Successfully'
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

module.exports = router;