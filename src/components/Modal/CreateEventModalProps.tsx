import React, { useState } from "react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (evento: { titulo: string; descripcion: string; fechaInicio: string }) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    horaInicio: "", // Agregado para almacenar la hora
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Combinar fecha y hora en formato ISO (LocalDateTime)
    const fechaCompleta = `${nuevoEvento.fechaInicio}T${nuevoEvento.horaInicio}:00`;
  
    // Llamar a la función onCreate con los datos combinados
    onCreate({
      ...nuevoEvento,
      fechaInicio: fechaCompleta, // Reemplaza fechaInicio con la fecha completa
    });
  
    // Limpiar el formulario
    setNuevoEvento({ titulo: "", descripcion: "", fechaInicio: "", horaInicio: "" });
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Evento</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            // Combina fecha y hora en un LocalDateTime compatible
            const fechaCompleta = `${nuevoEvento.fechaInicio}T${nuevoEvento.horaInicio}:00`;
            onCreate({ ...nuevoEvento, fechaInicio: fechaCompleta });
            setNuevoEvento({ titulo: "", descripcion: "", fechaInicio: "", horaInicio: "" }); // Limpia el formulario
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={nuevoEvento.titulo}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={nuevoEvento.descripcion}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={nuevoEvento.fechaInicio}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fechaInicio: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
            <input
              type="time"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={nuevoEvento.horaInicio}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, horaInicio: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 mr-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Crear
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateEventModal;
