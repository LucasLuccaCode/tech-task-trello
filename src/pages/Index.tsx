
import React from 'react';
import { KanbanProvider, useKanban } from '@/contexts/KanbanContext';
import { ProjectsList } from '@/components/kanban/ProjectsList';
import { KanbanView } from '@/components/kanban/KanbanView';

const AppContent: React.FC = () => {
  const { currentView } = useKanban();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {currentView === 'projects' ? <ProjectsList /> : <KanbanView />}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <KanbanProvider>
      <AppContent />
    </KanbanProvider>
  );
};

export default Index;
