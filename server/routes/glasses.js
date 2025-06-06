// server/routes/glasses.js

const express = require('express');
const router = express.Router();
const Glasses = require('../models/Glasses');

router.get('/', async (req, res) => {
  const all = await Glasses.find();
  res.json(all);
});

router.post('/', async (req, res) => {
  const newGlasses = new Glasses(req.body);
  await newGlasses.save();
  res.status(201).json(newGlasses);
});

module.exports = router;
