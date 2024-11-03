// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import Carousel from '../components/Carousel';
import LoginModal from '../components/Modal/LoginModal';
import RegisterModal from '../components/Modal/RegisterModal';
import SuccessModal from '../components/Modal/SuccessModal';

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    closeRegisterModal();
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      openLoginModal();
    }, 1000);
  };

  return (
    <div className="landing-page relative min-h-screen bg-gray-800 text-white">
      <div className="absolute top-4 right-4 z-10 flex space-x-4">
        <button className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={openLoginModal}>Login</button>
        <button className="bg-customRed hover:bg-customLightRed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={openRegisterModal}>Registrarse</button>
      </div>
      <div className="h1-container absolute inset-0 flex justify-center items-center z-0">
        <h1 className="text-center text-4xl">Welcome to the Project Management Tool</h1>
      </div>
      <div className="h2-container absolute bottom-4 inset-x-0 flex justify-center items-center flex-col">
        <h2 className="text-2xl">Dirigido a</h2>
        <h2 className="text-2xl">Gestores de Proyectos y Equipos de Desarrollo</h2>
      </div>
      <Carousel />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onRegisterSuccess={handleRegisterSuccess} />
      <SuccessModal isOpen={isSuccessModalOpen} message="Registro exitoso!" onClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
