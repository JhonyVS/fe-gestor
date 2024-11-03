import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
}

interface Card {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  cards: Card[];
}

const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        // Obtén el token de sessionStorage
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('id'); // Asumiendo que el ID del usuario también está guardado
        
        if (!token || !userId) {
          console.error('Token or userId is missing');
          return;
        }
        
        const response = await fetch(`http://localhost:8080/workspace/by-project-manager/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch boards');
        }

        const data = await response.json();
        
        // Mapear la respuesta para adaptarla a la estructura de Board
        const mappedBoards: Board[] = data.tableros.map((tablero: any) => ({
          id: tablero.id,
          title: tablero.titulo,
          cards: tablero.tarjetas.map((tarjeta: any) => ({
            id: tarjeta.id,
            title: tarjeta.titulo,
            tasks: tarjeta.tareas.map((tarea: any) => ({
              id: tarea.id,
              title: tarea.titulo,
              description: tarea.descripcion
            }))
          }))
        }));

        setBoards(mappedBoards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tableros</h1>
      
      {/* Mostrar tableros */}
      <div className="grid grid-cols-1 gap-8">
        {boards.map((board) => (
          <div key={board.id} className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{board.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {board.cards.map((card) => (
                <div key={card.id} className="p-4 bg-white rounded shadow-md">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <ul>
                    {card.tasks.map((task) => (
                      <li key={task.id} className="p-2 bg-gray-200 rounded mb-2">
                        {task.title}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Agregar tarea</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para agregar nuevo tablero */}
      <div className="mt-8">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Agregar nuevo tablero</button>
      </div>
    </div>
  );
};

export default BoardsPage;
