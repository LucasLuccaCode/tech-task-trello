
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
  const [activeTab, setActiveTab] = useState('projetos');

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 relative">
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-3">
              Kanban Manager
            </h1>
            <p className="text-white/70 text-lg">
              Organize suas tarefas e projetos de forma eficiente
            </p>
          </div>

          <Tabs defaultValue="projetos" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-center mb-6">
              <TabsList className="bg-black/30 border border-white/20">
                <TabsTrigger 
                  value="projetos" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  <FolderKanban className="w-4 h-4 mr-1" />
                  Projetos
                </TabsTrigger>
                <TabsTrigger 
                  value="todo" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  <ListTodo className="w-4 h-4 mr-1" />
                  To-Do
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm"
              />
            </div>

            <TabsContent value="projetos" className="mt-0">
              {filteredKanbanProjects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderKanban className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white/60 mb-2">
                    {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto criado'}
                  </h3>
                  <p className="text-white/40 mb-4">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Crie seu primeiro projeto para começar'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
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
                  <ListTodo className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white/60 mb-2">
                    {searchTerm ? 'Nenhuma lista encontrada' : 'Nenhuma lista criada'}
                  </h3>
                  <p className="text-white/40 mb-4">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Crie sua primeira lista de tarefas'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
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

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          {activeTab === 'projetos' ? (
            <Button
              onClick={() => setShowProjectModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
              size="icon"
            >
              <Plus className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowTodoModal(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-2xl h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
              size="icon"
            >
              <Plus className="w-6 h-6" />
            </Button>
          )}
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
