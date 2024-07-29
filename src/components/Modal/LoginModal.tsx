// src/components/LoginModal.tsx
import React from 'react';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import InputWithProps from '../InputWithProps';
import logo from '../../assets/logo.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl mb-4 text-center text-white">Login</h2>
        <form>
          <InputWithProps
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            label="Nombre de usuario"
            icon={faUser}
          />
          <InputWithProps
            id="password"
            type="password"
            placeholder="Contraseña"
            label="Contraseña"
            icon={faLock}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Iniciar Sesión
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

export default LoginModal;
