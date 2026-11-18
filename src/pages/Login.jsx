import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api.js';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      localStorage.setItem('token', data.token);

      // Decodificar rol del JWT (payload base64)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem('rol', payload.rol);
      localStorage.setItem('email', payload.sub);

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-5">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <div className="text-danger mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100"
            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}>
            Ingresar
          </button>
        </form>
        <p className="mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;