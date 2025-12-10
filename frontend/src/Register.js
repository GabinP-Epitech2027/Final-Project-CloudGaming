import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext'; // On utilise notre traducteur

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage(); // Récupère la fonction de traduction

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5001/api/user/register', {
                username,
                email, 
                password
            });
            alert("Compte créé ! Connecte-toi maintenant.");
            navigate('/login');
        } catch (err) {
            alert("Erreur: " + (err.response ? err.response.data : "Serveur erreur"));
        }
    };

    return (
        <div className="container">
             <div className="form-box">
                <Link to="/" style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '15px' }}>
                    {t('backHome')}
                </Link>
                
                <h2>{t('register')}</h2>
                
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder={t('userPlaceholder')} onChange={e => setUsername(e.target.value)} required />
                    <input type="email" placeholder={t('emailPlaceholder')} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder={t('passPlaceholder')} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">{t('registerBtn')}</button>
                </form>

                <p style={{marginTop: '15px', fontSize: '0.9rem'}}>
                    {t('yesAccount')} <Link to="/login" style={{color: '#e94560'}}>{t('login')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;