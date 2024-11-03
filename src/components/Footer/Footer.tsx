import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-1">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-center text-sm">
          Gestor de proyectos de ingenieria de software dirigido a Project Mananagers.
        </p>
      </div>
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-center text-sm">
          Jhony Veizaga Sanchez.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
