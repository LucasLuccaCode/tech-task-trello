
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
    <div className="min-w-80 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-white">{column.title}</h3>
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
              {column.tasks.length}
            </span>
          </div>
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 space-y-3 min-h-96 ${
              snapshot.isDraggingOver ? 'bg-gray-800/30' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'opacity-50' : ''}
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
              className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
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
