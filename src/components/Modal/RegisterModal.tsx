// src/components/Modal/RegisterModal.tsx
import React, { useState } from 'react';
import { faUser, faLock, faEnvelope, faCalendar, faPhone } from '@fortawesome/free-solid-svg-icons';
import InputWithProps from '../InputWithProps';
import logo from '../../assets/logo.png';
import axios from 'axios';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nacimiento: '1990-01-08', // Valor por defecto
    email: '',
    telefono: '',
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Verifica que nacimiento tenga un valor
    try {
      const response = await axios.post('http://localhost:8080/usuario/create', formData);
      console.log('Registro exitoso:', response.data);
      onRegisterSuccess();
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl mb-4 text-center text-white">Registro</h2>
        <form onSubmit={handleSubmit}>
          <InputWithProps
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            label="Nombre de usuario"
            icon={faUser}
            onChange={handleChange}
          />
          <InputWithProps
            id="email"
            type="email"
            placeholder="Correo electrónico"
            label="Correo electrónico"
            icon={faEnvelope}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            errorMessage="Por favor, introduce un correo electrónico válido."
            onChange={handleChange}
          />
          <InputWithProps
            id="nombres"
            type="text"
            placeholder="Nombres"
            label="Nombres"
            icon={faUser}
            pattern="^[a-zA-Z\s]+$"
            errorMessage="Por favor, introduce solo caracteres válidos de la A-Z y espacios."
            onChange={handleChange}
          />
          <InputWithProps
            id="apellidos"
            type="text"
            placeholder="Apellidos"
            label="Apellidos"
            icon={faUser}
            pattern="^[a-zA-Z\s]+$"
            errorMessage="Por favor, introduce solo caracteres válidos de la A-Z y espacios."
            onChange={handleChange}
          />
          <InputWithProps
            id="nacimiento" // Asegúrate de que coincida con la clave en formData
            type="date"
            placeholder="Fecha de nacimiento"
            label="Fecha de nacimiento"
            icon={faCalendar}
            defaultValue={formData.nacimiento} // Usar el valor del estado
            onChange={handleChange}
          />
          <InputWithProps
            id="telefono"
            type="text"
            placeholder="Teléfono"
            label="Teléfono"
            icon={faPhone}
            onChange={handleChange}
          />
          <InputWithProps
            id="password"
            type="password"
            placeholder="Contraseña"
            label="Contraseña"
            icon={faLock}
            pattern=".{5,}"
            errorMessage="La contraseña debe tener al menos 10 caracteres."
            onChange={handleChange}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
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
