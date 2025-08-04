import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

/**
 * Accessible navigation menu present on main screens.
 */
export default function NavBar() {
  return (
    <nav aria-label="Navegação principal">
      <ul className="navbar">
        <li>
          <Link to="/profile">Perfil</Link>
        </li>
        <li>
          <Link to="/tutorial">Tutorial</Link>
        </li>
        <li>
          <Link to="/modes">Mapa</Link>
        </li>
      </ul>
    </nav>
  );
}
