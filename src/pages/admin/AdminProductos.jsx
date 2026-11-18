import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', categoria: '', precio: '', stock: '', oferta: false });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setProductos(await apiFetch('/productos'));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const producto = {
      codigo: form.codigo,
      nombre: form.nombre,
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      oferta: form.oferta
    };

    try {
      if (editando) {
        await apiFetch(`/productos/${editando}`, {
          method: 'PUT',
          body: JSON.stringify(producto)
        });
      } else {
        await apiFetch('/productos', {
          method: 'POST',
          body: JSON.stringify(producto)
        });
      }
      setForm({ codigo: '', nombre: '', categoria: '', precio: '', stock: '', oferta: false });
      setEditando(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditar(prod) {
    setForm({ ...prod, precio: String(prod.precio), stock: String(prod.stock) });
    setEditando(prod.codigo);
  }

  async function handleEliminar(codigo) {
    try {
      await apiFetch(`/productos/${codigo}`, { method: 'DELETE' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h3>Gestión de productos</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-2">
            <input type="text" className="form-control" name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-3">
            <input type="text" className="form-control" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-2">
            <input type="text" className="form-control" name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-2">
            <input type="number" className="form-control" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} min="1" required />
          </div>
          <div className="col-12 col-md-2">
            <input type="number" className="form-control" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} min="0" required />
          </div>
          <div className="col-12 col-md-1 d-flex align-items-center">
            <input type="checkbox" className="form-check-input" name="oferta" checked={form.oferta} onChange={handleChange} />
            <label className="form-check-label ms-1">Oferta</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2"
          style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}>
          {editando ? 'Actualizar' : 'Crear'}
        </button>
        {editando && (
          <button type="button" className="btn btn-secondary mt-2 ms-2"
            onClick={() => { setEditando(null); setForm({ codigo: '', nombre: '', categoria: '', precio: '', stock: '', oferta: false }); }}>
            Cancelar
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Oferta</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.codigo}>
              <td>{prod.codigo}</td>
              <td>{prod.nombre}</td>
              <td>{prod.categoria}</td>
              <td>${prod.precio.toLocaleString('es-CL')}</td>
              <td>{prod.stock}</td>
              <td>{prod.oferta ? 'Sí' : 'No'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEditar(prod)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(prod.codigo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductos;