
import React from 'react';
import { Project } from '@/types/kanban';
import { Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onSettings: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onSettings }) => {
  const totalTasks = project.columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const completedTasks = project.columns
    .filter(col => col.title.toLowerCase().includes('concluí') || col.title.toLowerCase().includes('finaliz'))
    .reduce((acc, col) => acc + col.tasks.length, 0);

  return (
    <div 
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/80 transition-all cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.type.color }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {project.type.name}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-gray-700/50 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onSettings(project);
          }}
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </Button>
      </div>

      {project.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Progresso</span>
          <span className="text-gray-300">
            {completedTasks}/{totalTasks} tarefas
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(project.updatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit'
            })}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {project.columns.slice(0, 3).map((col) => (
            <div key={col.id} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span>{col.tasks.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
