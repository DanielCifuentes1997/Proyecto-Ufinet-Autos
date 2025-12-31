import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { type Car } from '../../types';
import './CarsPage.css';

const CarsPage = () => {
    const { logout } = useAuth();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState<Car>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        color: '',
        photoUrl: '' 
    });

    const fetchCars = async (query: string = '') => {
        try {
            const response = await api.get('/cars', {
                params: { search: query }
            });
            setCars(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCars(searchTerm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/cars/${editingId}`, formData);
                alert('Auto actualizado correctamente');
            } else {
                await api.post('/cars', formData);
                alert('Auto creado correctamente');
            }
            setFormData({ brand: '', model: '', year: new Date().getFullYear(), licensePlate: '', color: '', photoUrl: '' });
            setEditingId(null);
            fetchCars();
        } catch (error) {
            alert('Error al guardar. Verifica que la placa no esté duplicada.');
        }
    };

    const handleEdit = (car: Car) => {
        setFormData(car);
        setEditingId(car.id!);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este auto?')) {
            try {
                await api.delete(`/cars/${id}`);
                fetchCars(searchTerm);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ brand: '', model: '', year: new Date().getFullYear(), licensePlate: '', color: '', photoUrl: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) : value
        }));
    };

    return (
        <div className="cars-container">
            <div className="header-section">
                <h1>Mis Autos</h1>
                <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
            </div>

            <div className="car-form-card">
                <h3>{editingId ? 'Editar Auto' : 'Agregar Nuevo Auto'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group-item">
                            <input
                                name="brand"
                                placeholder="Marca (ej. Toyota)"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group-item">
                            <input
                                name="model"
                                placeholder="Modelo (ej. Corolla)"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group-item">
                            <input
                                name="year"
                                type="number"
                                placeholder="Año"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group-item">
                            <input
                                name="licensePlate"
                                placeholder="Placa (ABC-123)"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group-item">
                            <input
                                name="color"
                                placeholder="Color"
                                value={formData.color}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group-item">
                            <input
                                name="photoUrl"
                                placeholder="URL de la Foto (http://...)"
                                value={formData.photoUrl || ''}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {formData.photoUrl && (
                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <img 
                                src={formData.photoUrl} 
                                alt="Vista previa" 
                                style={{ height: '100px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                                onError={(e) => (e.currentTarget.style.display = 'none')} 
                            />
                        </div>
                    )}

                    <div className="action-buttons">
                        <button type="submit" className="btn-submit">
                            {editingId ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="search-container">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar por placa, marca o modelo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-submit" style={{ padding: '0.75rem 1.5rem' }}>
                        Buscar
                    </button>
                    {searchTerm && (
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={() => {
                                setSearchTerm('');
                                fetchCars('');
                            }}
                        >
                            Limpiar
                        </button>
                    )}
                </form>
            </div>

            <div className="table-responsive">
                {loading ? (
                    <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando información...</p>
                ) : (
                    <table className="cars-table">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Placa</th>
                                <th>Color</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.id}>
                                    <td>
                                        {car.photoUrl ? (
                                            <img 
                                                src={car.photoUrl} 
                                                alt={car.model} 
                                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} 
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#9ca3af' }}>
                                                N/A
                                            </div>
                                        )}
                                    </td>
                                    <td><strong>{car.brand}</strong></td>
                                    <td>{car.model}</td>
                                    <td>{car.year}</td>
                                    <td><span style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{car.licensePlate}</span></td>
                                    <td>{car.color}</td>
                                    <td>
                                        <div style={{ display: 'flex' }}>
                                            <button onClick={() => handleEdit(car)} className="btn-edit">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(car.id!)} className="btn-delete">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                        {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'No tienes autos registrados aún.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CarsPage;