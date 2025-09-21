// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const glassesRoutes = require('./routes/glasses');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'));

// Route de la racine
app.get('/', (req, res) => {
  res.send('API running');
});

// Enregistrement des routes
app.use('/api/auth', authRoutes);
app.use('/api/glasses', glassesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
