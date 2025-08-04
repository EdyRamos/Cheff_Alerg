import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Accessible navigation menu present on main screens.
 */
export default function NavBar() {
  return (
    <nav aria-label="Navegação principal">
      <ul
        style={{
          display: 'flex',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}
      >
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
