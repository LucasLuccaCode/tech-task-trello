
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useKanban } from '@/contexts/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  onCreateTask: (columnId: string) => void;
  onCreateColumn: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onCreateTask, onCreateColumn }) => {
  const { currentProject, moveTask, reorderTask, reorderColumns } = useKanban();

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Nenhum projeto selecionado</h2>
          <p className="text-gray-500">Selecione ou crie um projeto para começar</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // Se o item foi solto na mesma posição, não faz nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const columnIds = currentProject.columns
        .sort((a, b) => a.order - b.order)
        .map(col => col.id);
      
      const reorderedIds = Array.from(columnIds);
      const [movedId] = reorderedIds.splice(source.index, 1);
      reorderedIds.splice(destination.index, 0, movedId);
      
      reorderColumns(reorderedIds);
      return;
    }

    // Reordenação de tarefas
    if (source.droppableId === destination.droppableId) {
      // Mesma coluna - reordenar
      reorderTask(result.draggableId, source.droppableId, destination.index);
    } else {
      // Colunas diferentes - mover
      moveTask(result.draggableId, source.droppableId, destination.droppableId, destination.index);
    }
  };

  const sortedColumns = currentProject.columns.sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable 
          droppableId="board" 
          direction="horizontal" 
          type="column"
          ignoreContainerClipping={true}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex space-x-4 sm:space-x-6 h-full overflow-x-auto pb-6 ${
                snapshot.isDraggingOver ? 'bg-blue-900/10' : ''
              }`}
              style={{
                transition: 'background-color 0.2s ease',
              }}
            >
              {sortedColumns.map((column, index) => (
                <Draggable 
                  key={column.id} 
                  draggableId={column.id} 
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${
                        snapshot.isDragging 
                          ? 'opacity-80 rotate-2 shadow-2xl' 
                          : 'opacity-100'
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                        transition: snapshot.isDragging 
                          ? 'none' 
                          : 'transform 0.2s ease, opacity 0.2s ease',
                      }}
                    >
                      <KanbanColumn
                        column={column}
                        onCreateTask={onCreateTask}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              <div className="min-w-72 sm:min-w-80 flex-shrink-0">
                <Button
                  onClick={onCreateColumn}
                  variant="outline"
                  className="w-full h-12 border-dashed border-gray-600 hover:border-gray-500 bg-transparent hover:bg-gray-800/30 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Status
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
