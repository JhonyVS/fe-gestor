import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import InputWithProps from '../InputWithProps';
import logo from '../../assets/logo.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async () => {
    const credentials = {
      username: (document.getElementById('username') as HTMLInputElement).value,
      password: (document.getElementById('password') as HTMLInputElement).value,
    };

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar el token en sessionStorage
        sessionStorage.setItem('token', data.jwt);

        // Guardar los datos adicionales del usuario en sessionStorage
        sessionStorage.setItem('id',data.id);
        sessionStorage.setItem('user', data.username);
        sessionStorage.setItem('nombres', data.nombres);
        sessionStorage.setItem('apellidos', data.apellidos);

        // Guardar la lista de UUIDs de proyectos (la conviertes a JSON porque es un array)
        sessionStorage.setItem('projectUUIDs', JSON.stringify(data.projectUUIDs));

        // Redirigir al home
        navigate('/home');
      } else {
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud de autenticación', error);
    }
  };

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
              onClick={handleLogin}
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
