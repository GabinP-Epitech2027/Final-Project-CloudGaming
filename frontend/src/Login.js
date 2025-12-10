import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5001/api/user/login', {
                email, 
                password
            });
            localStorage.setItem('auth-token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/'); 
        } catch (err) {
            alert("Erreur login");
        }
    };

    return (
        <div className="container">
             <div className="form-box">
                <Link to="/" style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '15px' }}>
                    {t('backHome')}
                </Link>

                <h2>{t('login')}</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder={t('emailPlaceholder')} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder={t('passPlaceholder')} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">{t('loginBtn')}</button>
                </form>
                <p style={{marginTop: '15px', fontSize: '0.9rem'}}>
                    {t('noAccount')} <Link to="/register" style={{color: '#e94560'}}>{t('register')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;