
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Column } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  onCreateTask: (columnId: string) => void;
  dragHandleProps?: any;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  onCreateTask, 
  dragHandleProps 
}) => {
  return (
    <div className="min-w-72 sm:min-w-80 bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800 flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="p-3 sm:p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{column.title}</h3>
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full flex-shrink-0 transition-colors">
              {column.tasks.length}
            </span>
          </div>
          <div 
            {...dragHandleProps} 
            className="cursor-grab active:cursor-grabbing p-1 hidden sm:block hover:bg-gray-700/50 rounded transition-all duration-200 hover:scale-110"
          >
            <GripVertical className="w-4 h-4 text-gray-500 hover:text-gray-400 transition-colors" />
          </div>
        </div>
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 sm:p-4 space-y-3 min-h-64 sm:min-h-96 transition-all duration-300 ${
              snapshot.isDraggingOver 
                ? 'bg-blue-900/30 border-2 border-dashed border-blue-400/50 rounded-b-lg' 
                : 'border-2 border-transparent'
            }`}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'opacity-100 rotate-2 scale-110 shadow-2xl cursor-grabbing' 
                        : 'opacity-100 hover:scale-102 hover:shadow-lg cursor-grab'
                    }`}
                    style={{
                      ...provided.draggableProps.style,
                      zIndex: snapshot.isDragging ? 9999 : 'auto',
                      transform: snapshot.isDragging 
                        ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                        : provided.draggableProps.style?.transform,
                    }}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            <Button
              onClick={() => onCreateTask(column.id)}
              variant="ghost"
              className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 text-sm py-2 h-auto transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar tarefa
            </Button>
          </div>
        )}
      </Droppable>
    </div>
  );
};
