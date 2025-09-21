// backend/seed.js - Database seeding script
require('dotenv').config();
const mongoose = require('mongoose');
const Glasses = require('./models/Glasses');
const glassesData = require('../glassesData.json');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glassesApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('📡 Connected to MongoDB');

    // Clear existing glasses data
    await Glasses.deleteMany({});
    console.log('🗑️  Cleared existing glasses data');

    // Transform and insert glasses data
    const glassesToInsert = glassesData.map(glass => ({
      code: glass.code, // Use 'code' directly from JSON
      name: glass.name,
      brand: glass.brand,
      imageUrl: glass.imageUrl,
      tags: {
        shapeMatch: glass.tags.shapeMatch || [],
        style: glass.tags.style,
        frameShape: glass.tags.frameShape,
        material: glass.tags.material,
        colors: glass.tags.colors || [],
        vibe: glass.tags.vibe
      }
    }));

    await Glasses.insertMany(glassesToInsert);
    console.log(`✅ Successfully seeded ${glassesToInsert.length} glasses into the database`);

    // Verify the data
    const count = await Glasses.countDocuments();
    console.log(`📊 Total glasses in database: ${count}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedDatabase();
