// src/components/RegisterModal.tsx
import React from 'react';
import { faUser, faLock, faEnvelope, faCalendar } from '@fortawesome/free-solid-svg-icons';
import InputWithProps from '../InputWithProps';
import logo from '../assets/logo.png';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl mb-4 text-center text-white">Registro</h2>
        <form>
          <InputWithProps
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            label="Nombre de usuario"
            icon={faUser}
          />
          <InputWithProps
            id="email"
            type="email"
            placeholder="Correo electrónico"
            label="Correo electrónico"
            icon={faEnvelope}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            errorMessage="Por favor, introduce un correo electrónico válido."
          />
          <InputWithProps
            id="nombres"
            type="text"
            placeholder="Nombres"
            label="Nombres"
            icon={faUser}
            pattern="^[a-zA-Z\s]+$"
            errorMessage="Por favor, introduce solo caracteres válidos de la A-Z y espacios."
          />
          <InputWithProps
            id="apellidos"
            type="text"
            placeholder="Apellidos"
            label="Apellidos"
            icon={faUser}
            pattern="^[a-zA-Z\s]+$"
            errorMessage="Por favor, introduce solo caracteres válidos de la A-Z y espacios."
          />
          <InputWithProps
            id="fecha_nacimiento"
            type="date"
            placeholder="Fecha de nacimiento"
            label="Fecha de nacimiento"
            icon={faCalendar}
            defaultValue="1990-01-08"
          />
          <InputWithProps
            id="password"
            type="password"
            placeholder="Contraseña"
            label="Contraseña"
            icon={faLock}
            pattern=".{10,}"
            errorMessage="La contraseña debe tener al menos 10 caracteres."
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Registrarse
            </button>
            <button
              className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
