import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GamePlayer from './GamePlayer';
import Login from './Login';
import Register from './Register';
import Leaderboard from './Leaderboard';
import { LanguageProvider, useLanguage } from './LanguageContext';
import './App.css';

function AppContent() {
  const { t, setLang, lang } = useLanguage();
  const username = localStorage.getItem('username');

  // CONFIGURATION DES JEUX
  // id: Doit correspondre à la BDD (ex: "Crossword")
  // folder: Le nom du dossier dans /public/games/ (souvent minuscule)
  const games = [
    { id: 'bowling', folder: 'bowling', name: 'Bowling Pro', icon: '🎳', link: '/play/bowling' },
    { id: 'Crossword', folder: 'crossword', name: 'Crossword', icon: '📝', link: '/play/crossword' }, // Note la majuscule à l'ID !
    { id: 'memory', folder: 'memory', name: 'Super Memory', icon: '🧠', link: '/play/memory' },
    { id: 'restrictedorder', folder: 'restrictedorder', name: 'Restricted Order', icon: '👾', link: '/play/restricted_order' },
    { id: 'fortunewheel', folder: 'fortunewheel', name: 'Fortune Wheel', icon: '🎡', link: '/play/fortune_wheel' },
  ];

  const flagStyle = (current) => ({
    cursor: 'pointer',
    opacity: lang === current ? 1 : 0.5,
    fontSize: '1.5rem',
    marginLeft: '10px'
  });

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">{t('title')}</div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{marginRight: '20px'}}>
                <span onClick={() => setLang('fr')} style={flagStyle('fr')}>🇫🇷</span>
                <span onClick={() => setLang('en')} style={flagStyle('en')}>🇺🇸</span>
                <span onClick={() => setLang('es')} style={flagStyle('es')}>🇪🇸</span>
            </div>
            <div className="nav-links">
            {username ? (
                <>
                <span style={{marginRight: '15px'}}>{t('welcome')}, <strong>{username}</strong></span>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }}>{t('logout')}</button>
                </>
            ) : (
                <Link to="/login"><button>{t('login')}</button></Link>
            )}
            </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
            <div className="container">
                <h1>{t('chooseGame')}</h1>
                <p>{t('subTitle')}</p>
                
                {/* Grille des jeux */}
                <div className="games-grid">
                {games.map((g) => (
                    <Link to={g.link} key={g.id} className="game-card">
                    <span className="game-icon">{g.icon}</span>
                    <h3>{g.name}</h3>
                    <span className="btn-play">{t('play')}</span>
                    </Link>
                ))}
                </div>

                {/* Exemple de leaderboard Global sur l'accueil */}
                <div style={{ marginTop: '50px' }}>
                    <h2>Top Scores - Crossword</h2>
                    <Leaderboard gameId="Crossword" />
                </div>
            </div>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROUTES DYNAMIQUES POUR LES JEUX */}
        {games.map(g => (
            <Route 
                key={g.id}
                path={g.link} 
                element={
                    <GamePlayer 
                        gameId={g.id}         // "Crossword" (pour la BDD)
                        gameFolder={g.folder} // "crossword" (pour le dossier public)
                        gameDisplayName={g.name} 
                    />
                } 
            />
        ))}

      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
        <Router>
             <AppContent />
        </Router>
    </LanguageProvider>
  );
}

export default App;