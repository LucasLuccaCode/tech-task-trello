
import React from 'react';
import { KanbanProvider } from '@/contexts/KanbanContext';
import { KanbanHeader } from '@/components/kanban/KanbanHeader';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

const Index = () => {
  return (
    <KanbanProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex flex-col">
        <KanbanHeader />
        <KanbanBoard />
      </div>
    </KanbanProvider>
  );
};

export default Index;
