
import React from 'react';
import { KanbanProvider, useKanban } from '@/contexts/KanbanContext';
import { ProjectsList } from '@/components/kanban/ProjectsList';
import { KanbanView } from '@/components/kanban/KanbanView';

const AppContent = () => {
  const { currentView } = useKanban();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {currentView === 'projects' ? <ProjectsList /> : <KanbanView />}
    </div>
  );
};

const Index = () => {
  return (
    <KanbanProvider>
      <AppContent />
    </KanbanProvider>
  );
};

export default Index;
