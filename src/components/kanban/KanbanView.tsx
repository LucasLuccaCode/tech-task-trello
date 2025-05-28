
import React, { useState } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { KanbanBoard } from './KanbanBoard';
import { TodoView } from './TodoView';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';
import { ProjectSettings } from './ProjectSettings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

export const KanbanView: React.FC = () => {
  const { currentProject, setCurrentView } = useKanban();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex flex-col">
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('projects')}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-gray-700 hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentProject.type.color }}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {currentProject.name}
            </h1>
          </div>
          
          {currentProject.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {currentProject.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard 
            onCreateTask={(columnId) => {
              setSelectedColumnId(columnId);
              setShowTaskModal(true);
            }}
            onCreateColumn={() => setShowColumnModal(true)}
          />
        </div>
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

      <ProjectSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        project={currentProject}
      />
    </>
  );
};
