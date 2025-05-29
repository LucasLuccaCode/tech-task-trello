
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Column } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { GripVertical } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  dragHandleProps?: any;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  dragHandleProps 
}) => {
  return (
    <div className="min-w-72 sm:min-w-80 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex-shrink-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{column.title}</h3>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 transition-colors">
              {column.tasks.length}
            </span>
          </div>
          <div 
            {...dragHandleProps} 
            className="cursor-grab active:cursor-grabbing p-1 hidden sm:block hover:bg-white/10 rounded transition-all duration-200 hover:scale-110"
          >
            <GripVertical className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
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
                ? 'bg-blue-500/20 border-2 border-dashed border-blue-300/50 rounded-b-xl' 
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
                        ? 'opacity-100 rotate-2 scale-110 shadow-2xl cursor-grabbing z-[9999]' 
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
          </div>
        )}
      </Droppable>
    </div>
  );
};
