const express = require('express');
const ChatbotMessage = require('../models/ChatbotMessage');

const router = express.Router();

const generateResponse = (text) => {
  const normalized = text.toLowerCase();

  // GREETING
  if (
    normalized.includes('hi') ||
    normalized.includes('hello') ||
    normalized.includes('hey')
  ) {
    return 'Welcome to AI Solutions. I can help you explore services, events, articles, registrations, ratings, and business inquiries. What would you like to discover?';
  }

  // COMPANY
  if (
    normalized.includes('about') ||
    normalized.includes('company') ||
    normalized.includes('ai solutions')
  ) {
    return 'AI Solutions delivers enterprise AI services including consulting, machine learning, automation, analytics, and intelligent business solutions with measurable outcomes.';
  }

  // NAME
  if (
    normalized.includes('name') ||
    normalized.includes('title') ||
    normalized.includes('designation')
  ) {
    return 'I am the AI Solutions Virtual Assistant, created to help you navigate services, events, articles, and project inquiries.';
  }

  // SERVICES
  if (
    normalized.includes('service') ||
    normalized.includes('solution') ||
    normalized.includes('automation')
  ) {
    return 'Our services include AI Consulting, Machine Learning Solutions, Automation Services, Data Analytics, Virtual Assistance, and Rapid Prototyping. Tell me your goal and I will suggest the best service.';
  }

  // AI CONSULTING
  if (
    normalized.includes('consulting') ||
    normalized.includes('strategy')
  ) {
    return 'AI Consulting helps organizations plan AI adoption, digital transformation, and deployment strategies tailored to business objectives.';
  }

  // MACHINE LEARNING
  if (
    normalized.includes('machine learning') ||
    normalized.includes('ml')
  ) {
    return 'Our Machine Learning solutions include predictive models, intelligent automation, analytics, and custom AI development.';
  }

  // AUTOMATION
  if (
    normalized.includes('workflow') ||
    normalized.includes('automate')
  ) {
    return 'Automation Services streamline operations, reduce manual work, and improve efficiency using intelligent processes.';
  }

  // ARTICLES
  if (
    normalized.includes('article') ||
    normalized.includes('research') ||
    normalized.includes('pdf')
  ) {
    return 'Explore our Research & Insights section to discover enterprise AI articles, downloadable PDFs, and industry knowledge.';
  }

  // EVENTS
  if (
    normalized.includes('event') ||
    normalized.includes('gallery') ||
    normalized.includes('conference')
  ) {
    return 'Our events include AI innovation showcases, enterprise summits, technology conferences, and networking opportunities.';
  }

  // REGISTER EVENT
  if (
    normalized.includes('register') ||
    normalized.includes('reserve') ||
    normalized.includes('join event')
  ) {
    return 'You can register from the Event Experience section by completing your details and reserving your spot.';
  }

  // GALLERY
  if (
    normalized.includes('latest event') ||
    normalized.includes('upcoming')
  ) {
    return 'Visit Event Gallery to explore upcoming and latest AI events and innovation showcases.';
  }

  // RATINGS
  if (
    normalized.includes('rating') ||
    normalized.includes('review') ||
    normalized.includes('feedback')
  ) {
    return 'Our platform currently maintains strong customer satisfaction with verified feedback and performance-driven experiences.';
  }

  // PRICE
  if (
    normalized.includes('price') ||
    normalized.includes('cost') ||
    normalized.includes('pricing')
  ) {
    return 'Pricing depends on project scope, complexity, data requirements, deployment model, and business goals. Share your requirements for a tailored estimate.';
  }

  // DEMO
  if (
    normalized.includes('demo') ||
    normalized.includes('trial')
  ) {
    return 'We can arrange a guided solution demo and help you understand implementation strategy for your business use case.';
  }

  // DISCOVERY SESSION
  if (
    normalized.includes('schedule') &&
    normalized.includes('discovery') &&
    normalized.includes('session')
  ) {
    return 'A link to the Contact page is provided below to schedule your discovery session: /contact';
  }

  // CONTACT
  if (
    normalized.includes('contact') ||
    normalized.includes('support') ||
     normalized.includes('engage') ||
    normalized.includes('help')
  ) {
    return 'You can contact AI Solutions through the Contact section, submit an inquiry form, or connect directly with our support team.';
  }

  // CHATBOT
  if (
    normalized.includes('assistant') ||
    normalized.includes('chatbot')
  ) {
    return 'I can guide you through services, events, articles, registrations, ratings, and project inquiries.';
  }

  // PROJECT
  if (
    normalized.includes('project') ||
    normalized.includes('requirement')
  ) {
    return 'Please share your business goals, timeline, and expected outcome so our team can recommend the right AI solution.';
  }

  // ADMIN
  if (
    normalized.includes('admin')
  ) {
    return 'Admin Portal provides management access for events, articles, gallery updates, and website content administration.';
  }

  // THANKS
  if (
    normalized.includes('thank')
  ) {
    return 'You are welcome. Let me know if you would like help exploring AI Solutions.';
  }


  return 'I am sorry, I did not understand that. Can I help you with something else ?';
};

router.post('/', async (req, res) => {
  const userMessage = String(req.body.userMessage || '').trim();
  if (!userMessage) {
    return res.status(400).send({ message: 'Missing userMessage' });
  }

  const botResponse = generateResponse(userMessage);
  const message = new ChatbotMessage({ userMessage, botResponse });
  await message.save();

  res.send({ botResponse });
});

router.get('/', async (req, res) => {
  const history = await ChatbotMessage.find().sort({ createdAt: -1 }).limit(100);
  res.send(history);
});

module.exports = router;
