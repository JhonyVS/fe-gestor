import React, { useState, useEffect } from "react";

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
}

interface UsuarioBasicoDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
}

interface Props {
  equipoId: string;
  onClose: () => void;
  onIntegranteAgregado: () => void; // Callback para notificar que se agregó un integrante
}

const AgregarIntegranteModal: React.FC<Props> = ({ equipoId, onClose, onIntegranteAgregado }) => {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState<UsuarioBasicoDTO | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch roles cuando se monta el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error("Token no encontrado en el almacenamiento");
        }

        const response = await fetch("http://localhost:8080/rol/all", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener roles");
        }

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los roles");
      }
    };

    fetchRoles();
  }, []);

  // Buscar usuario por email
  const buscarUsuarioPorEmail = async () => {
    if (!email) {
      setError("Por favor, introduce un email válido.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error("Token no encontrado en el almacenamiento");
      }

      const response = await fetch(`http://localhost:8080/usuario/email/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Usuario no encontrado");
      }

      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error(error);
      setUsuario(null);
      setError("No se encontró un usuario con ese email");
    } finally {
      setLoading(false);
    }
  };

  // Agregar integrante al equipo
  const agregarIntegrante = async () => {
    if (!usuario || !rolSeleccionado) {
      setError("Por favor, selecciona un usuario y un rol.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error("Token no encontrado en el almacenamiento");
      }

      const response = await fetch("http://localhost:8080/miembro/create", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          equipoId: equipoId,
          rolId: rolSeleccionado,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el integrante");
      }

      // Notificar al componente padre que se agregó un integrante
      onIntegranteAgregado();
      setSuccess("Integrante agregado correctamente.");
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500); // Cerrar el modal después de 1.5 segundos
    } catch (error) {
      console.error(error);
      setError("No se pudo agregar el integrante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Agregar Integrante</h2>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="border border-gray-300 p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introduce el email del usuario"
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={buscarUsuarioPorEmail}
            disabled={loading || !email}
          >
            {loading ? "Buscando..." : "Buscar Usuario"}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
          {usuario && (
            <p className="text-green-600 text-sm mt-2">
              Usuario encontrado: {usuario.nombres} {usuario.apellidos}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Rol</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={rolSeleccionado || ""}
            onChange={(e) => setRolSeleccionado(e.target.value)}
          >
            <option value="" disabled>
              Selecciona un rol
            </option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            onClick={agregarIntegrante}
            disabled={!usuario || !rolSeleccionado || loading}
          >
            {loading ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarIntegranteModal;