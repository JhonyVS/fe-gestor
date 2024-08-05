// src/components/Menu.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Menu: React.FC = () => {
  const menuItemClass = "text-xl hover:text-gray-500";

  return (
    <nav className="bg-white text-gray-800 p-5">
      <ul className="flex space-x-20 justify-center">
        {['home', 'boards', 'projects', 'teams', 'staff'].map((item) => (
          <li key={item}>
            <NavLink
              to={`/${item}`}
              className={({ isActive }) =>
                isActive ? `${menuItemClass} font-bold` : menuItemClass
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
