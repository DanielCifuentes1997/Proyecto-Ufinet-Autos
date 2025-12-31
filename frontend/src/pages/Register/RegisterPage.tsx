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
                <p style={{ marginBottom: '1.5rem' }}>Únete para gestionar tus vehículos</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Tu nombre y apellido"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Crea un nombre de usuario único"
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
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary">
                        Registrarse
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;