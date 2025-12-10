const router = require('express').Router();
const Score = require('../models/Score');
const User = require('../models/User'); // Import User model to populate
const jwt = require('jsonwebtoken');

// Middleware optionnel : Essaie de lire le token, mais ne bloque pas si absent
const optionalAuth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return next(); // Pas de token -> on passe en mode anonyme

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // On attache l'user à la requête
        next();
    } catch (err) {
        next(); // Token invalide -> on passe en mode anonyme
    }
};

// POSTER UN SCORE
router.post('/', optionalAuth, async (req, res) => {
    const score = new Score({
        gameId: req.body.gameId,
        scoreValue: req.body.scoreValue,
        // Si req.user existe (via le middleware), on met son ID, sinon null
        userId: req.user ? req.user._id : null,
        // Si pas d'user, on utilise "Anonymous" par défaut
        guestName: req.user ? undefined : 'Anonymous'
    });

    try {
        const savedScore = await score.save();
        res.json(savedScore);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// RECUPERER LE LEADERBOARD (Top 10 par jeu)
router.get('/:gameId', async (req, res) => {
    try {
        // On cherche les scores du jeu, on trie par score décroissant, limite à 10
        // .populate('userId', 'username') va chercher le pseudo dans la table User si userId existe
        const scores = await Score.find({ gameId: req.params.gameId })
            .sort({ scoreValue: -1 })
            .limit(10)
            .populate('userId', 'username'); 
            
        // On formate les données pour que le front n'ait pas à réfléchir
        const formattedScores = scores.map(s => {
            return {
                name: s.userId ? s.userId.username : s.guestName, // Si user -> son pseudo, sinon -> guestName
                score: s.scoreValue,
                date: s.date
            };
        });

        res.json(formattedScores);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;