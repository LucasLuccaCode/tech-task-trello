
import React, { useState } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { TodoModal } from './TodoModal';
import { ProjectSettings } from './ProjectSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Search, ListTodo, FolderKanban } from 'lucide-react';

export const ProjectsList: React.FC = () => {
  const { 
    projects, 
    searchTerm, 
    setSearchTerm, 
    setCurrentProject, 
    setCurrentView 
  } = useKanban();
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const kanbanProjects = projects.filter(p => p.type.id !== 'todo');
  const todoProjects = projects.filter(p => p.type.id === 'todo');

  const filteredKanbanProjects = kanbanProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTodoProjects = todoProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project);
    setCurrentView('kanban');
  };

  const handleProjectSettings = (project: any) => {
    setSelectedProject(project);
    setShowSettings(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-4">
          <Tabs defaultValue="projetos" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-gray-800/50 border border-gray-700">
                <TabsTrigger 
                  value="projetos" 
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                >
                  <FolderKanban className="w-4 h-4 mr-1" />
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

              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Novo Projeto</span>
                </Button>
                <Button
                  onClick={() => setShowTodoModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Nova Lista</span>
                </Button>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <TabsContent value="projetos" className="mt-0">
              {filteredKanbanProjects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto criado'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Crie seu primeiro projeto para começar'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowProjectModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Projeto
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredKanbanProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={handleProjectSelect}
                      onSettings={handleProjectSettings}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="todo" className="mt-0">
              {filteredTodoProjects.length === 0 ? (
                <div className="text-center py-12">
                  <ListTodo className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    {searchTerm ? 'Nenhuma lista encontrada' : 'Nenhuma lista criada'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Crie sua primeira lista de tarefas'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowTodoModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Lista
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTodoProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={handleProjectSelect}
                      onSettings={handleProjectSettings}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      <TodoModal
        isOpen={showTodoModal}
        onClose={() => setShowTodoModal(false)}
      />

      {selectedProject && (
        <ProjectSettings
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}
    </>
  );
};
