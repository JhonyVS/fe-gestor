import { useEffect, useState } from "react";

// Define la interfaz para el tipo User
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  nacimiento: string;
  email: string;
  telefono: string;
  username: string;
  activado: boolean;
  motivoSuspension: string | null;
  rol: string | null;
}

// Define el tipo para el resultado del hook
type UseFetchUserResult = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const useFetchUser = (id: string): UseFetchUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/usuario/find/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
};
