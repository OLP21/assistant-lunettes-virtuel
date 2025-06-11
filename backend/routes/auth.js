// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SALT_ROUNDS = 10;

// Registration from the client
router.post('/register', async (req, res) => {
const { username, email, password} = req.body;
try{
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email en cours d'utilisation"});

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ username, email, passwordHash});
    res.status(201).json({ id: newUser._id, username: newUser.username, email: newUser.email});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur'});
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password} = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Identifiants invalides'});
    
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'Identifiants invalides'});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        res.json({ token, user: { id: user._id, username: user.username, email: user.email}});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur serveur'});
        }
    });

    module.exports = router;