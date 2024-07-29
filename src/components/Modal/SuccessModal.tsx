// src/components/Modal/SuccessModal.tsx
import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2 className="text-2xl mb-4 text-center text-white">{message}</h2>
      </div>
    </div>
  );
};

export default SuccessModal;
