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
    
    // Estado inicial incluyendo photoUrl vacío
    const [formData, setFormData] = useState<Car>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        color: '',
        photoUrl: '' 
    });

    const fetchCars = async () => {
        try {
            const response = await api.get('/cars');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

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
            // Resetear formulario incluyendo photoUrl
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
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este auto?')) {
            try {
                await api.delete(`/cars/${id}`);
                fetchCars();
            } catch (error) {
                console.error('Error deleting car', error);
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
                        <input
                            name="brand"
                            placeholder="Marca (ej. Toyota)"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <input
                            name="model"
                            placeholder="Modelo (ej. Corolla)"
                            value={formData.model}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <input
                            name="year"
                            type="number"
                            placeholder="Año"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <input
                            name="licensePlate"
                            placeholder="Placa"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <input
                            name="color"
                            placeholder="Color"
                            value={formData.color}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        {/* Nuevo campo para la URL de la Foto */}
                        <input
                            name="photoUrl"
                            placeholder="URL de la Foto (http://...)"
                            value={formData.photoUrl || ''}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    {/* Vista previa pequeña si hay una URL válida en el formulario */}
                    {formData.photoUrl && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Vista previa:</p>
                            <img 
                                src={formData.photoUrl} 
                                alt="Vista previa" 
                                style={{ height: '80px', borderRadius: '5px', objectFit: 'cover' }} 
                                onError={(e) => (e.currentTarget.style.display = 'none')} // Ocultar si el link está roto
                            />
                        </div>
                    )}

                    <div className="action-buttons">
                        <button type="submit" className="btn-submit">
                            {editingId ? 'Actualizar' : 'Guardar'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading ? (
                <p>Cargando autos...</p>
            ) : (
                <table className="cars-table">
                    <thead>
                        <tr>
                            <th>Foto</th> {/* Nueva columna */}
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
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#888' }}>
                                            N/A
                                        </div>
                                    )}
                                </td>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.licensePlate}</td>
                                <td>{car.color}</td>
                                <td>
                                    <button onClick={() => handleEdit(car)} className="btn-edit">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(car.id!)} className="btn-delete">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cars.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>No tienes autos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CarsPage;