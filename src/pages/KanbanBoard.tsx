import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./../redux/hooks/AppDispatch";
import { fetchWorkspaceByProjectManagerId } from "./../features/workspace/workspaceSlice";
import { guardarCambiosTablero } from "./../features/tablero/tableroSlice";
import { RootState } from "./../app/store";

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
}

interface Tarjeta {
  id: string;
  titulo: string;
  tareas: Tarea[];
}

interface Tablero {
  id: string;
  titulo: string;
  descripcion: string;
  tarjetas: Tarjeta[];
}

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workspace, loading, error } = useSelector(
    (state: RootState) => state.workspace
  );

  const [tablero, setTablero] = useState<Tablero | null>(null);

  // Fetch workspace when component mounts
  useEffect(() => {
    const projectManagerId = sessionStorage.getItem("id");
    if (projectManagerId) {
      dispatch(fetchWorkspaceByProjectManagerId(projectManagerId));
    }
  }, [dispatch]);

  // Set the first tablero
  useEffect(() => {
    if (workspace && workspace.tableros.length > 0) {
      setTablero(workspace.tableros[0]);
    }
  }, [workspace]);

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination || !tablero) return;

    const sourceTarjetaIndex = tablero.tarjetas.findIndex(
      (tarjeta) => tarjeta.id === source.droppableId
    );
    const destinationTarjetaIndex = tablero.tarjetas.findIndex(
      (tarjeta) => tarjeta.id === destination.droppableId
    );

    if (sourceTarjetaIndex === -1 || destinationTarjetaIndex === -1) return;

    const updatedTarjetas = JSON.parse(JSON.stringify(tablero.tarjetas));

    const sourceTarjeta = updatedTarjetas[sourceTarjetaIndex];
    const destinationTarjeta = updatedTarjetas[destinationTarjetaIndex];

    const [movedTarea] = sourceTarjeta.tareas.splice(source.index, 1);
    destinationTarjeta.tareas.splice(destination.index, 0, movedTarea);

    setTablero({ ...tablero, tarjetas: updatedTarjetas });

    // Guardar cambios automáticamente al soltar la tarea
    const dataToSend = updatedTarjetas.map((tarjeta: Tarjeta) => ({
      tarjetaId: tarjeta.id,
      tareasIds: tarjeta.tareas.map((tarea: Tarea) => tarea.id),
    }));

    dispatch(guardarCambiosTablero({ tableroId: tablero.id, data: dataToSend }))
      .unwrap()
      .then(() => {
        console.log("Cambios guardados automáticamente.");
      })
      .catch((error) => {
        console.error("Error al guardar los cambios automáticamente:", error);
      });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tablero) return <p>No hay un tablero disponible.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {tablero.tarjetas.map((tarjeta) => (
            <Droppable key={tarjeta.id} droppableId={tarjeta.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg w-60 shadow-md"
                >
                  <h3 className="text-lg font-bold text-blue-700">
                    {tarjeta.titulo}
                  </h3>
                  <ul>
                    {tarjeta.tareas.map((tarea, index) => (
                      <Draggable
                        key={tarea.id}
                        draggableId={tarea.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 rounded-md shadow-sm mt-2"
                          >
                            <h4 className="text-sm font-medium">
                              {tarea.titulo}
                            </h4>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
