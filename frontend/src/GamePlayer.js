import React, { useEffect, useCallback, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { useLanguage } from './LanguageContext'; // <--- Import Important

const GamePlayer = ({ gameId, gameDisplayName, gameFolder }) => {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
  const { t } = useLanguage(); // <--- Hook de traduction

  const { unityProvider, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: `/games/${gameFolder}/Build/${gameFolder}.loader.js`,
    dataUrl: `/games/${gameFolder}/Build/${gameFolder}.data`,
    frameworkUrl: `/games/${gameFolder}/Build/${gameFolder}.framework.js`,
    codeUrl: `/games/${gameFolder}/Build/${gameFolder}.wasm`,
  });

  const handleGameOver = useCallback((score) => {
    // ... Logique inchangée ...
    const token = localStorage.getItem('auth-token');
    axios.post('https://final-project-cloudgaming-backend.onrender.com/api/scores', {
        gameId: gameId, 
        scoreValue: score
    }, {
        headers: { 'auth-token': token }
    })
    .then(() => {
        setRefreshLeaderboard(prev => prev + 1);
    })
    .catch(err => console.error("❌ Erreur sauvegarde", err));
  }, [gameId]);

  useEffect(() => {
    addEventListener("SendScoreToReact", handleGameOver);
    return () => {
      removeEventListener("SendScoreToReact", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (
    <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '50px' }}>
        
        <div style={{ width: '100%', maxWidth: '960px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px' }}>
                {t('backHome')}
            </Link>
            <h1>{gameDisplayName}</h1>
            <div style={{ width: '100px' }}></div>
        </div>
        
        <div className="unity-wrapper">
            <Unity unityProvider={unityProvider} style={{ width: "960px", height: "600px" }} />
        </div>

        <div style={{ width: '100%', maxWidth: '800px', marginTop: '40px' }}>
            {/* Le leaderboard utilisera désormais sa propre traduction interne */}
            <Leaderboard gameId={gameId} refreshTrigger={refreshLeaderboard} />
        </div>
    </div>
  );
};

export default GamePlayer;