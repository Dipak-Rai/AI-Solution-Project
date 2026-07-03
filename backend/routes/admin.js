const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const getToken = (req) => {
  const auth = req.headers.authorization;
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null;
};

const authenticate = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.send({
    token,
    admin: {
      username: admin.username,
      fullName: 'AI Solutions Administrator',
      email: 'admin@ai-solutions.com',
      role: 'Administrator',
      bio: 'Responsible for managing AI Solutions content and analytics.',
    },
  });
});

router.post('/logout', authenticate, (req, res) => {
  res.send({ message: 'Logged out' });
});

router.get('/profile', authenticate, (req, res) => {
  const admin = req.admin;
  res.send({
    username: admin.username,
    fullName: 'AI Solutions Administrator',
    email: 'admin@ai-solutions.com',
    role: 'Administrator',
    bio: 'Responsible for managing AI Solutions content and analytics.',
    avatar: '',
  });
});

router.put('/profile', authenticate, async (req, res) => {
  const admin = req.admin;
  const profile = {
    username: admin.username,
    fullName: req.body.fullName || 'AI Solutions Administrator',
    email: req.body.email || 'admin@ai-solutions.com',
    role: req.body.role || 'Administrator',
    bio: req.body.bio || 'Responsible for managing AI Solutions content and analytics.',
    avatar: req.body.avatar || '',
  };

  res.send(profile);
});

router.post('/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: 'Both current and new password are required' });
  }

  const admin = req.admin;
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(400).send({ message: 'Current password is incorrect' });
  }

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.send({ message: 'Password updated successfully' });
});

module.exports = router;
