import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCarrito, vaciarCarrito } from '../services/dataStore.js';
import { apiFetch } from '../services/api.js';

function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ direccion: '', entrega: 'retiro' });
  const [error, setError] = useState('');

  const carrito = obtenerCarrito();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (carrito.length === 0) {
      navigate('/compra-fallida');
      return;
    }

    const items = carrito.map(item => ({
      codigo: item.codigo,
      cantidad: item.cantidad
    }));

    try {
      await apiFetch('/ordenes', {
        method: 'POST',
        body: JSON.stringify({ items, ...form })
      });
      vaciarCarrito();
      navigate('/compra-exitosa');
    } catch (err) {
      setError(err.message);
      navigate('/compra-fallida');
    }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Dirección de envío</label>
          <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Método de entrega</label>
          <select className="form-select" name="entrega" value={form.entrega} onChange={handleChange}>
            <option value="retiro">Retiro en tienda</option>
            <option value="despacho">Despacho a domicilio</option>
          </select>
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button type="submit" className="btn btn-primary"
          style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}>
          Confirmar compra
        </button>
      </form>
    </div>
  );
}

export default Checkout;