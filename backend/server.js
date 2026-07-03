const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const EventRegistration = require('./models/EventRegistration');
const Feedback = require('./models/Feedback');
const Admin = require('./models/Admin');

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174'];

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const path = require('path');

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads'),
    {
      setHeaders: (res, filePath) => {

        if (
          path.extname(filePath)
            .toLowerCase() === '.pdf'
        ) {

          res.setHeader(
            'Content-Type',
            'application/pdf'
          );

          res.setHeader(
            'Content-Disposition',
            'inline'
          );

        }

      },
    }
  )
);

// Serve uploaded gallery images
app.use('/uploads', express.static('uploads'));

const seedData = async () => {
  const eventsCount = await EventRegistration.countDocuments();
  const feedbackCount = await Feedback.countDocuments();
  const adminCount = await Admin.countDocuments();

  if (!feedbackCount) {
    await Feedback.create([
      { name: 'John Doe', email: 'john@example.com', rating: 5, comment: 'Outstanding support and AI delivery.' },
      { name: 'Jane Smith', email: 'jane@example.com', rating: 4, comment: 'Great customer experience and quick results.' },
    ]);
  }

  if (!eventsCount) {
    await EventRegistration.create([
      { name: 'Early Bird', email: 'earlybird@example.com', phone: '1234567890', company: 'AI Labs', country: 'UK', eventInterest: 'AI Workshop' },
      { name: 'Tech Lead', email: 'techlead@example.com', phone: '0987654321', company: 'TechCo', country: 'UK', eventInterest: 'Digital Assistant Launch' },
    ]);
  }

  if (!adminCount) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
  }
};

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/demo', require('./routes/demo'));
app.use('/api/events', require('./routes/events'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use(
  '/uploads',
  express.static('uploads', {
    setHeaders: (res) => {
      res.setHeader(
        'Content-Disposition',
        'inline'
      );
    },
  })
);

const PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    await seedData();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port in backend/.env.`);
        process.exit(1);
      }
      throw error;
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});