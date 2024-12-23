import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { FaPlus, FaTasks, FaTrello, FaClipboard, FaEllipsisV } from "react-icons/fa";
import EditTaskModal from "../components/Modal/EditTaskModalProps";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import CreateTaskModal from "../components/Modal/CreateTaskModal";
import CreateCardModal from "../components/Modal/CreateCardModal";



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
  const [taskMenuVisible, setTaskMenuVisible] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; titulo: string; descripcion: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cardIdForNewTask, setCardIdForNewTask] = useState<string | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [boardIdForNewCard, setBoardIdForNewCard] = useState<string | null>(null);

  // Función para cargar los tableros desde el backend
    const refreshBoards = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("id");

        if (!token || !userId) {
          console.error("Token or userId is missing");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/workspace/by-project-manager/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch boards");
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
              description: tarea.descripcion,
            })),
          })),
        }));
        setBoards(mappedBoards);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    useEffect(() => {
      refreshBoards();
    }, []);

    // Abrir el modal para editar una tarea
    const handleEditTask = (taskId: string, taskData: { titulo: string; descripcion: string }) => {
      setSelectedTask({ id: taskId, ...taskData });
      setIsEditModalOpen(true);
    };

    // Guardar los cambios de la tarea y refrescar los tableros
    const handleSaveTask = async (data: { titulo: string; descripcion: string }) => {
      if (!selectedTask) return;


      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/tarea/update/${selectedTask.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        // Refrescar el estado global de los tableros
        await refreshBoards();

        console.log("Task updated successfully!");
      } catch (error) {
        console.error("Error updating task:", error);
      }

      setIsEditModalOpen(false); // Cierra el modal después de guardar
    };

    const handleAddBoard = () => {
      console.log("Add new board");
      // Add your endpoint logic here
    };



    const handleOpenAddCardModal = (boardId: string) => {
      setBoardIdForNewCard(boardId);
      setIsAddCardModalOpen(true);
    };
    const handleAddCard = async (data: { titulo: string; descripcion: string }) => {
      if (!boardIdForNewCard) return;
  
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/tarjeta/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableroId: boardIdForNewCard,
            titulo: data.titulo,
            descripcion: data.descripcion,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create card");
        }
  
        // Refrescar tableros después de crear la tarjeta
        await refreshBoards();
        setIsAddCardModalOpen(false);
        setBoardIdForNewCard(null);
      } catch (error) {
        console.error("Error creating card:", error);
      }
    };

    const handleCreateTask = async (data: { titulo: string; descripcion: string }) => {
      if (!cardIdForNewTask) return;
      
  
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }
      console.log(cardIdForNewTask);
      try {
        const response = await fetch(`http://localhost:8080/tarea/create`,{
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            
            body: JSON.stringify({
              titulo: data.titulo,
              descripcion: data.descripcion,
              tarjetaId: cardIdForNewTask,
              
            }),
          }
        );
        
  
        if (!response.ok) {
          throw new Error("Failed to create task");
        }
  
        console.log("Task created successfully!");
  
        // Refrescar los tableros
        await refreshBoards();
      } catch (error) {
        console.error("Error creating task:", error);
      } finally {
        setIsCreateModalOpen(false);
        setCardIdForNewTask(null);
      }
    };
    

    const handleDeleteTask = async () => {
      if (!taskToDelete) return;
  
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/tarea/delete/${taskToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }
  
        console.log("Task deleted successfully!");
  
        // Refrescar el estado de los tableros
        await refreshBoards();
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setIsDeleteModalOpen(false);
      }
    };

    const toggleTaskMenu = (taskId: string) => {
      setTaskMenuVisible((prev) => (prev === taskId ? null : taskId));
    };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceBoardIndex = boards.findIndex((board) =>
      board.cards.some((card) => card.id === source.droppableId)
    );
    const destBoardIndex = boards.findIndex((board) =>
      board.cards.some((card) => card.id === destination.droppableId)
    );

    if (sourceBoardIndex === -1 || destBoardIndex === -1) return;

    const sourceCard = boards[sourceBoardIndex].cards.find(
      (card) => card.id === source.droppableId
    );
    const destCard = boards[destBoardIndex].cards.find(
      (card) => card.id === destination.droppableId
      
    );
    
    if (!sourceCard || !destCard) return;

    // Update tasks locally
    const [movedTask] = sourceCard.tasks.splice(source.index, 1);
    destCard.tasks.splice(destination.index, 0, movedTask);

    const updatedBoards = [...boards];
    setBoards(updatedBoards);

    // Prepare data for the backend
    const dataToSend = updatedBoards.map((board) =>
      board.cards.map((card) => ({
        tarjetaId: card.id,
        tareasIds: card.tasks.map((task) => task.id),
      }))
    );

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("Token is missing");
        return;
      }

      // Send updated tasks to the backend
      await fetch(
        `http://localhost:8080/tablero/${boards[sourceBoardIndex].id}/actualizar-tareas`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend.flat()),
        }
      );

      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-8 bg-gradient-to-b from-gray-100 to-white">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 flex items-center justify-center space-x-3">
          <FaTrello /> <span>Tableros</span>
        </h1>

        <div className="space-y-10">
          {boards.map((board) => (
            <div
              key={board.id}
              className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
                  <FaClipboard /> <span>{board.title}</span>
                </h2>
                <button
                  className="p-2 text-green-500 hover:text-green-700"
                  onClick={() => handleOpenAddCardModal(board.id)}
                >
                  <FaPlus />
                </button>
              </div>
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
                          <Draggable
                            draggableId={task.id}
                            index={index}
                            key={task.id}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 flex justify-between items-center relative"
                              >
                                <span>{task.title}</span>
                                <button
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => toggleTaskMenu(task.id)}
                                >
                                  <FaEllipsisV />
                                </button>
                                {taskMenuVisible === task.id && (
                                  <div
                                    className="absolute right-0 top-10 bg-white border border-gray-300 rounded-lg shadow-lg w-40 z-50"
                                    onMouseLeave={() => setTaskMenuVisible(null)} // Cierra el menú cuando el mouse deja el área del menú
                                  >
                                    <button
                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setTaskMenuVisible(null); // Cierra el menú contextual
                                        handleEditTask(task.id, {
                                          titulo: task.title,
                                          descripcion: task.description,
                                        });
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setTaskMenuVisible(null); // Cierra el menú contextual
                                        setIsDeleteModalOpen(true);
                                        setTaskToDelete(task.id);
                                      }}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                )}
                              </li>
                            )}
                          </Draggable>
                        ))}
                        <div className="flex justify-center mt-4">
                           {/* Botón para agregar tarea */}
                            <button
                              onClick={() => {
                                setCardIdForNewTask(card.id);
                                setIsCreateModalOpen(true);
                              }}
                              className="mt-4 text-blue-500 hover:text-blue-700 flex items-center"
                            >
                              <FaPlus className="mr-2" />
                              Agregar Tarea
                            </button>
                          </div>
                          {provided.placeholder}
                        </ul>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
            onClick={handleAddBoard}
          >
            <FaPlus className="text-lg" /> Agregar Tablero
          </button>
        </div>
      </div>
      {/* Renderiza el modal aquí */}
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveTask}
          initialData={selectedTask}
        />
      )}
      
      {/* Modal de confirmación para eliminar tareas */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        message="¿Estás seguro de que deseas eliminar esta tarea?"
      />

      {/* Modal para crear nueva tarea */}
      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTask}
        />
      )}

      {/* Modal para agregar tarjetas */}
      {isAddCardModalOpen && (
        <CreateCardModal
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          onSave={handleAddCard}
        />
      )}
      
    </DragDropContext>
  );
  
};

export default BoardsPage;
