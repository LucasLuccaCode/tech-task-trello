
import React, { useState } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { KanbanBoard } from './KanbanBoard';
import { TodoView } from './TodoView';
import { ColumnModal } from './ColumnModal';
import { ProjectSettings } from './ProjectSettings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

export const KanbanView: React.FC = () => {
  const { currentProject, setCurrentView } = useKanban();
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!currentProject) {
    return null;
  }

  // Se for um projeto To-Do, mostrar a view específica
  if (currentProject.type.id === 'todo') {
    return <TodoView />;
  }

  // Caso contrário, mostrar o Kanban normal
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 flex flex-col">
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('projects')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-white/20 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-2">
              Kanban Manager
            </h1>
            <p className="text-white/60 text-sm">
              Organize suas tarefas e projetos de forma eficiente
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: currentProject.type.color }}
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">
              {currentProject.name}
            </h2>
          </div>
          
          {currentProject.description && (
            <p className="text-white/60 text-sm text-center line-clamp-2 max-w-2xl mx-auto">
              {currentProject.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard 
            onCreateColumn={() => setShowColumnModal(true)}
          />
        </div>
      </div>

      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
      />

      <ProjectSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        project={currentProject}
      />
    </>
  );
};
