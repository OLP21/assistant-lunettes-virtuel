// backend/models/Glasses.js

// backend/models/Glasses.js
const mongoose = require('mongoose');

const GlassesSchema = new mongoose.Schema({
  code: String,
  brand: String,        
  imageUrl: String
});

module.exports = mongoose.model('Glasses', GlassesSchema);
