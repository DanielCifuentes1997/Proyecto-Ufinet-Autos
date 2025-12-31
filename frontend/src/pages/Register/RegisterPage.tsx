import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import '../Login/LoginPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // El backend espera: { fullName, username, password }
            await api.post('/auth/register', formData);
            alert('¡Registro exitoso! Ahora inicia sesión.');
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Error al registrar usuario. El usuario podría ya existir.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Crear Cuenta</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Usuario (Username)</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Registrarse
                    </button>
                </form>
                <div style={{ marginTop: '1rem' }}>
                    <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;