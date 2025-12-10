const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Configuration
dotenv.config();

// Connexion à la Base de Données
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('Connecté à MongoDB !'))
    .catch(err => console.log('Erreur connexion DB:', err));

// Middlewares
app.use(express.json()); // Pour comprendre le JSON entrant

app.use(cors({
    origin: [
        "http://localhost:3000",                     // Pour tes tests locaux
        "https://final-project-cloudgaming.onrender.com" // 👈 TA VRAIE URL FRONTEND
    ],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`📡 Requête reçue : ${req.method} ${req.url}`);
    next();
});

// Import des Routes
const authRoute = require('./routes/auth');
const scoreRoute = require('./routes/scores');

// Utilisation des Routes
app.use('/api/user', authRoute);
app.use('/api/scores', scoreRoute);

// Lancement du serveur
app.listen(process.env.PORT || 5001, () => console.log('Serveur Backend en marche sur le port 5001'));