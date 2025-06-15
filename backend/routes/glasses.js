// backend/routes/glasses.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const jsonPath = path.join(__dirname, '..', '..', 'glassesData.json');
  const json = fs.readFileSync(jsonPath, 'utf-8');
  res.json(JSON.parse(json));
});

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Modification non prise en charge' });
});

module.exports = router;
