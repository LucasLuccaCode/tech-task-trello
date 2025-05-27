
import React, { useState } from 'react';
import { Task } from '@/types/kanban';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { TaskModal } from './TaskModal';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showModal, setShowModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-800/80 transition-colors active:scale-[0.98] touch-manipulation"
      >
        <h4 className="font-medium text-white mb-2 line-clamp-2 text-sm sm:text-base">{task.title}</h4>
        
        {task.description && (
          <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
            <AlertCircle className="w-3 h-3" />
            <span>{getPriorityLabel(task.priority)}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
              <span className="sm:hidden">{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
            </div>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-gray-400 text-xs px-2 py-1">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {task.assignee && (
          <div className="flex items-center space-x-1 text-gray-400 text-xs">
            <User className="w-3 h-3" />
            <span className="truncate">{task.assignee}</span>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        task={task}
      />
    </>
  );
};
