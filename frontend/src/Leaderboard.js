import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext'; // <--- Import Important

function Leaderboard({ gameId, refreshTrigger }) {
    const [scores, setScores] = useState([]);
    const { t } = useLanguage(); // <--- Hook de traduction

    useEffect(() => {
        axios.get(`https://final-project-cloudgaming-backend.onrender.com:5001/api/scores/${gameId}`)
            .then(res => setScores(res.data))
            .catch(err => console.error("Erreur chargement leaderboard:", err));
    }, [gameId, refreshTrigger]);

    return (
        <div className="leaderboard-box" style={{ width: '100%', marginTop: '20px' }}>
            <h3 style={{ borderBottom: '2px solid #e94560', paddingBottom: '10px' }}>
                {t('leaderboardTitle')} {gameId}
            </h3>
            
            {scores.length === 0 ? (
                <p style={{ padding: '20px', fontStyle: 'italic' }}>{t('noScores')}</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {scores.map((s, index) => (
                        <li key={index} className="score-item" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '10px', 
                            background: index === 0 ? 'rgba(233, 69, 96, 0.2)' : 'transparent',
                            borderBottom: '1px solid #30475e'
                        }}>
                            <div>
                                <span style={{ fontWeight: 'bold', color: '#e94560', marginRight: '15px' }}>
                                    #{index + 1}
                                </span>
                                <span>{s.name}</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>{s.score} {t('score')}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Leaderboard;