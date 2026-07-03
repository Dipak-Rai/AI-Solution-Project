const mongoose = require('mongoose');

const chatbotMessageSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatbotMessage', chatbotMessageSchema);