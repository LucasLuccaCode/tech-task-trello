
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Settings, ListTodo } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { ProjectModal } from './ProjectModal';
import { ProjectSettings } from './ProjectSettings';
import { TodoModal } from './TodoModal';

export const KanbanHeader: React.FC = () => {
  const { currentProject, projects, setCurrentProject } = useKanban();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const kanbanProjects = projects.filter(p => p.type.id !== 'todo');
  const todoProjects = projects.filter(p => p.type.id === 'todo');

  return (
    <>
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-3 sm:p-4">
        <Tabs defaultValue="kanban" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-gray-800/50 border border-gray-700">
              <TabsTrigger 
                value="kanban" 
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
              >
                Projetos
              </TabsTrigger>
              <TabsTrigger 
                value="todo" 
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
              >
                <ListTodo className="w-4 h-4 mr-1" />
                To-Do
              </TabsTrigger>
            </TabsList>

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
          </div>

          <TabsContent value="kanban" className="mt-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <select
                  value={currentProject?.type.id === 'todo' ? '' : (currentProject?.id || '')}
                  onChange={(e) => {
                    const project = kanbanProjects.find(p => p.id === e.target.value);
                    setCurrentProject(project || null);
                  }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-1 min-w-0"
                >
                  <option value="">Selecione um projeto</option>
                  {kanbanProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                
                {currentProject && currentProject.type.id !== 'todo' && (
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentProject.type.color }}
                    />
                    <span className="text-gray-300 text-xs sm:text-sm hidden sm:inline">
                      {currentProject.type.name}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowProjectModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-sm ml-2 flex-shrink-0"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Novo</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="todo" className="mt-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <select
                  value={currentProject?.type.id === 'todo' ? (currentProject?.id || '') : ''}
                  onChange={(e) => {
                    const project = todoProjects.find(p => p.id === e.target.value);
                    setCurrentProject(project || null);
                  }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-1 min-w-0"
                >
                  <option value="">Selecione uma lista de tarefas</option>
                  {todoProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => setShowTodoModal(true)}
                className="bg-green-600 hover:bg-green-700 text-sm ml-2 flex-shrink-0"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Nova Lista</span>
              </Button>
            </div>
          </TabsContent>

          {currentProject && (
            <div className="mt-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                {currentProject.name}
              </h1>
              {currentProject.description && (
                <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                  {currentProject.description}
                </p>
              )}
            </div>
          )}
        </Tabs>
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      <TodoModal
        isOpen={showTodoModal}
        onClose={() => setShowTodoModal(false)}
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
