import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaProjectDiagram, FaUsers, FaUserTie } from 'react-icons/fa';

const Menu: React.FC = () => {
  const menuItemClass = "text-lg md:text-xl hover:text-gray-500 flex items-center space-x-2";

  const menuItems = [
    { name: 'home', label: 'Home', icon: <FaHome /> },
    { name: 'activities', label: 'Activities', icon: <FaTasks /> },
    { name: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { name: 'teams', label: 'Teams', icon: <FaUsers /> },
    // { name: 'profile', label: 'Profile', icon: <FaUserTie /> },
  ];

  return (
    <nav className="bg-white text-gray-800 p-5 shadow-md">
      <ul className="flex flex-wrap justify-center space-x-4 md:space-x-10">
        {menuItems.map(({ name, label, icon }) => (
          <li key={name} className="my-2">
            <NavLink
              to={`/${name}`}
              className={({ isActive }) =>
                isActive ? `${menuItemClass} font-bold` : menuItemClass
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;

