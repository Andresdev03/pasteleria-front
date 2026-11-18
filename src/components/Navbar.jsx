import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#8B4513' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/" style={{ fontFamily: 'Pacifico, cursive' }}>
          Pastelería 1000 Sabores
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link text-white" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link text-white" to="/catalogo">Catálogo</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link text-white" to="/categorias">Categorías</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link text-white" to="/ofertas">Ofertas</NavLink></li>
            {rol === 'CLIENTE' && (
              <li className="nav-item"><NavLink className="nav-link text-white" to="/carrito">Carrito</NavLink></li>
            )}
            {rol === 'ADMIN' && (
              <li className="nav-item"><NavLink className="nav-link text-white" to="/admin">Admin</NavLink></li>
            )}
            {!rol && (
              <li className="nav-item"><NavLink className="nav-link text-white" to="/login">Ingresar</NavLink></li>
            )}
            {rol && (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-light ms-2" onClick={logout}>Cerrar sesión</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;