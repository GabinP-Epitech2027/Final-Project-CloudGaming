const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// INSCRIPTION
router.post('/register', async (req, res) => {
    // 1. Vérifier si l'email existe déjà
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // 2. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Créer l'utilisateur
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // 1. Vérifier l'email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email ou mot de passe incorrect');

    // 2. Vérifier le mot de passe
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email ou mot de passe incorrect');

    // 3. Créer et assigner un token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send({ token: token, username: user.username });
});

module.exports = router;