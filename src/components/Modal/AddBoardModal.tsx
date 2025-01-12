import React, { useState } from "react";

interface AddBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { titulo: string; descripcion: string }) => void;
}

const AddBoardModal: React.FC<AddBoardModalProps> = ({ isOpen, onClose, onSave }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSave = () => {
    if (titulo.trim() && descripcion.trim()) {
      onSave({ titulo, descripcion });
      setTitulo("");
      setDescripcion("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Tablero</h2>
        
        {/* Campo de título */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ingresa el título del tablero"
            required
          />
        </div>
        
        {/* Campo de descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ingresa una descripción para el tablero"
            required
          />
        </div>
        
        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBoardModal;
