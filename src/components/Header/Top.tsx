// src/components/Top.tsx
import React from 'react';
import { FaBell, FaUserCircle, FaCog } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Top: React.FC = () => {
  return (
    <div className="bg-gray-700 text-white p-5 flex items-center relative">
      <div className="flex items-center">
        <img src={logo} alt="Icon" className="w-10 h-10 mr-2" />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-xl font-bold">Project Manager Tool</span>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <FaBell className="w-6 h-6" />
        <div className="flex items-center space-x-2">
          <FaUserCircle className="w-8 h-8" />
          <span>Jhony Veizaga Sanchez</span>
        </div>
        <FaCog className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Top;
