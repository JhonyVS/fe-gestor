import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FaPlus, FaTasks, FaColumns, FaTrello, FaClipboard } from 'react-icons/fa';

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
  const [showTaskForm, setShowTaskForm] = useState<{ show: boolean; cardId: string | null }>({ show: false, cardId: null });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showCardForm, setShowCardForm] = useState<{ show: boolean; boardId: string | null }>({ show: false, boardId: null });

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('id');
        
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceBoardIndex = boards.findIndex(board =>
      board.cards.some(card => card.id === source.droppableId)
    );
    const destBoardIndex = boards.findIndex(board =>
      board.cards.some(card => card.id === destination.droppableId)
    );

    if (sourceBoardIndex === -1 || destBoardIndex === -1) return;

    const sourceCard = boards[sourceBoardIndex].cards.find(card => card.id === source.droppableId);
    const destCard = boards[destBoardIndex].cards.find(card => card.id === destination.droppableId);

    if (!sourceCard || !destCard) return;

    const [movedTask] = sourceCard.tasks.splice(source.index, 1);
    destCard.tasks.splice(destination.index, 0, movedTask);

    const updatedBoards = [...boards];
    setBoards(updatedBoards);
  };

  const handleAddTaskClick = (cardId: string) => {
    setShowTaskForm({ show: true, cardId });
  };

  const handleAddTask = () => {
    if (showTaskForm.cardId) {
      setBoards(prevBoards => {
        return prevBoards.map(board => {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === showTaskForm.cardId) {
                return {
                  ...card,
                  tasks: [
                    ...card.tasks,
                    {
                      id: `task-${Date.now()}`,
                      title: newTaskTitle,
                      description: newTaskDescription
                    }
                  ]
                };
              }
              return card;
            })
          };
        });
      });
    }
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowTaskForm({ show: false, cardId: null });
  };
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title: newBoardTitle || `Nuevo Tablero ${boards.length + 1}`,
      cards: [] // Inicialmente vacío
    };
    setBoards([...boards, newBoard]);
    setNewBoardTitle('');
    setShowBoardForm(false);
  };
  const handleAddCard = () => {
    if (showCardForm.boardId) {
      setBoards(prevBoards => {
        return prevBoards.map(board => {
          if (board.id === showCardForm.boardId) {
            return {
              ...board,
              cards: [
                ...board.cards,
                {
                  id: `card-${Date.now()}`,
                  title: newCardTitle,
                  tasks: [] // Inicialmente vacío
                }
              ]
            };
          }
          return board;
        });
      });
    }
    setNewCardTitle('');
    setShowCardForm({ show: false, boardId: null });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-8 bg-gradient-to-b from-gray-100 to-white">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 flex items-center justify-center space-x-3">
          <FaTrello /> <span>Tableros</span>
        </h1>
        
        <div className="space-y-10">
        {boards.map((board) => (
          <div key={board.id} className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
              <FaClipboard /> <span>{board.title}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {board.cards.map((card) => (
                <Droppable droppableId={card.id} key={card.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-w-[300px] p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200"
                    >
                      <h3 className="text-xl font-medium mb-3 text-blue-600 flex items-center space-x-2">
                        <FaTasks /> <span>{card.title}</span>
                      </h3>
                      <ul className="space-y-2">
                        {card.tasks.map((task, index) => (
                          <Draggable draggableId={task.id} index={index} key={task.id}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
                              >
                                {task.title}
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                      <button onClick={() => handleAddTaskClick(card.id)} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center space-x-2">
                        <FaPlus /> <span>Agregar tarea</span>
                        </button>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
            <button
              onClick={() => setShowCardForm({ show: true, boardId: board.id })}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus /> <span>Agregar tarjeta</span>
            </button>
          </div>
        ))}
        </div>

        {showTaskForm.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl mb-4">Nueva Tarea</h2>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Descripción de la tarea"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              ></textarea>
              <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Agregar</button>
              <button onClick={() => setShowTaskForm({ show: false, cardId: null })} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        )}

        {showBoardForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl mb-4">Nuevo Tablero</h2>
              <input
                type="text"
                placeholder="Título del tablero"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button onClick={handleAddBoard} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Agregar</button>
              <button onClick={() => setShowBoardForm(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        )}

        {showCardForm.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl mb-4">Nueva Tarjeta</h2>
              <input
                type="text"
                placeholder="Título de la tarjeta"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button onClick={handleAddCard} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Agregar</button>
              <button onClick={() => setShowCardForm({ show: false, boardId: null })} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowBoardForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-transform transform hover:scale-105 flex items-center space-x-3"
          >
            <FaPlus /> <span>Agregar nuevo tablero</span>
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardsPage;

                     
