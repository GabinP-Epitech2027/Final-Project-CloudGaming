const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    gameId: { type: String, required: true }, // ex: "Bowling", "Memory"
    scoreValue: { type: Number, required: true },
    // Si connecté, on met son ID ici :
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Si anonyme, on met "Anonymous" (ou le pseudo qu'il a choisi en guest) :
    guestName: { type: String, default: 'Anonymous' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);