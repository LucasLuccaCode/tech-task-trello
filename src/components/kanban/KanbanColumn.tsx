
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
    <div className="min-w-72 sm:min-w-80 bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800 flex-shrink-0 shadow-lg">
      <div className="p-3 sm:p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{column.title}</h3>
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full flex-shrink-0">
              {column.tasks.length}
            </span>
          </div>
          <div 
            {...dragHandleProps} 
            className="cursor-grab active:cursor-grabbing p-1 hidden sm:block hover:bg-gray-700/50 rounded transition-colors"
          >
            <GripVertical className="w-4 h-4 text-gray-500 hover:text-gray-400" />
          </div>
        </div>
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 sm:p-4 space-y-3 min-h-64 sm:min-h-96 transition-all duration-200 ${
              snapshot.isDraggingOver 
                ? 'bg-blue-900/20 border-blue-500/30' 
                : ''
            }`}
            style={{
              borderWidth: snapshot.isDraggingOver ? '2px' : '0px',
              borderStyle: 'dashed',
            }}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging 
                        ? 'opacity-90 rotate-1 shadow-xl scale-105' 
                        : 'opacity-100'
                    }`}
                    style={{
                      ...provided.draggableProps.style,
                      transition: snapshot.isDragging 
                        ? 'none' 
                        : 'transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
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
              className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 text-sm py-2 h-auto transition-all"
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
