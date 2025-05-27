
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { ProjectModal } from './ProjectModal';
import { ProjectSettings } from './ProjectSettings';

export const KanbanHeader: React.FC = () => {
  const { currentProject, projects, setCurrentProject } = useKanban();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={currentProject?.id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.id === e.target.value);
                setCurrentProject(project || null);
              }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um projeto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            
            {currentProject && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentProject.type.color }}
                />
                <span className="text-gray-300 text-sm">{currentProject.type.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {currentProject && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="border-gray-700 hover:bg-gray-800"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              onClick={() => setShowProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {currentProject && (
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-white">{currentProject.name}</h1>
            {currentProject.description && (
              <p className="text-gray-400 mt-1">{currentProject.description}</p>
            )}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      {currentProject && (
        <ProjectSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          project={currentProject}
        />
      )}
    </>
  );
};
