// backend/models/Glasses.js
const mongoose = require('mongoose');

// A schema for the nested tags object
const TagsSchema = new mongoose.Schema({
  shapeMatch: [String],
  style: String,
  frameShape: String,
  material: String,
  colors: [String],
  vibe: String
}, { _id: false }); // _id: false prevents MongoDB from creating an _id for the sub-document

const GlassesSchema = new mongoose.Schema({
  code: { // We'll use 'code' as the unique identifier, which corresponds to 'id' in your new JSON
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  tags: TagsSchema // Embed the tags schema
});

module.exports = mongoose.model('Glasses', GlassesSchema);