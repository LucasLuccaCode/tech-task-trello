
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useKanban } from '@/contexts/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnModal } from './ColumnModal';

export const KanbanBoard: React.FC = () => {
  const { currentProject, moveTask, reorderTask, reorderColumns } = useKanban();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

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

    if (source.droppableId === destination.droppableId) {
      // Reordenando dentro da mesma coluna
      reorderTask(result.draggableId, source.droppableId, destination.index);
    } else {
      // Movendo entre colunas
      moveTask(result.draggableId, source.droppableId, destination.droppableId, destination.index);
    }
  };

  const handleCreateTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowTaskModal(true);
  };

  return (
    <>
      <div className="flex-1 p-6 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex space-x-6 h-full overflow-x-auto pb-6"
              >
                {currentProject.columns
                  .sort((a, b) => a.order - b.order)
                  .map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <KanbanColumn
                            column={column}
                            onCreateTask={handleCreateTask}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                
                <div className="min-w-80">
                  <Button
                    onClick={() => setShowColumnModal(true)}
                    variant="outline"
                    className="w-full h-12 border-dashed border-gray-600 hover:border-gray-500 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Coluna
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedColumnId('');
        }}
        columnId={selectedColumnId}
      />

      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
      />
    </>
  );
};
