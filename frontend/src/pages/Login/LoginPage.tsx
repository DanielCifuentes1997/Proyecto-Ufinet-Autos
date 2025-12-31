import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/authenticate', {
                username,
                password
            });

            login(response.data.token);
            navigate('/autos');
        } catch (err) {
            setError('Credenciales incorrectas o error en el servidor');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>¡Bienvenido!</h2>
                <p style={{ marginBottom: '1.5rem' }}>Ingresa a tu gestión de autos</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            placeholder="ej. juan.perez"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Ingresar
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;