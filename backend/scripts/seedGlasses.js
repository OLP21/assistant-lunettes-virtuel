require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Glasses = require('../models/Glasses');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const dataPath = path.join(__dirname, '..', '..', 'glassesData.json');
    const glasses = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await Glasses.deleteMany({});
    await Glasses.insertMany(glasses);

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
