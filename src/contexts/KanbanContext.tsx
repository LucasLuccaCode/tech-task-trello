
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectType, Task, Column, DEFAULT_PROJECT_TYPES } from '@/types/kanban';

interface KanbanContextType {
  projects: Project[];
  projectTypes: ProjectType[];
  currentProject: Project | null;
  createProject: (name: string, description: string, typeId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (project: Project | null) => void;
  createTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  reorderTask: (taskId: string, columnId: string, newIndex: number) => void;
  createColumn: (column: Omit<Column, 'id' | 'tasks'>) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTypes] = useState<ProjectType[]>(DEFAULT_PROJECT_TYPES);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('kanban-projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) {
        setCurrentProject(parsedProjects[0]);
      }
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('kanban-projects', JSON.stringify(projects));
  }, [projects]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const createProject = (name: string, description: string, typeId: string) => {
    const projectType = projectTypes.find(type => type.id === typeId);
    if (!projectType) return;

    const newProject: Project = {
      id: generateId(),
      name,
      description,
      type: projectType,
      columns: projectType.defaultColumns.map(col => ({
        ...col,
        id: generateId(),
        tasks: []
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProject]);
    if (!currentProject) {
      setCurrentProject(newProject);
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const createTask = (columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentProject) return;

    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedColumns = currentProject.columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: [...column.tasks, newTask] }
        : column
    );

    const updatedProject = { ...currentProject, columns: updatedColumns };
    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    }));

    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const deleteTask = (taskId: string) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));

    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    if (!currentProject) return;

    let taskToMove: Task | null = null;
    const updatedColumns = currentProject.columns.map(column => {
      if (column.id === fromColumnId) {
        const task = column.tasks.find(t => t.id === taskId);
        if (task) {
          taskToMove = task;
          return { ...column, tasks: column.tasks.filter(t => t.id !== taskId) };
        }
      }
      return column;
    });

    if (!taskToMove) return;

    const finalColumns = updatedColumns.map(column => {
      if (column.id === toColumnId) {
        const newTasks = [...column.tasks];
        newTasks.splice(newIndex, 0, taskToMove);
        return { ...column, tasks: newTasks };
      }
      return column;
    });

    updateProject(currentProject.id, { columns: finalColumns });
  };

  const reorderTask = (taskId: string, columnId: string, newIndex: number) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.map(column => {
      if (column.id === columnId) {
        const tasks = [...column.tasks];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        const [task] = tasks.splice(taskIndex, 1);
        tasks.splice(newIndex, 0, task);
        return { ...column, tasks };
      }
      return column;
    });

    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const createColumn = (columnData: Omit<Column, 'id' | 'tasks'>) => {
    if (!currentProject) return;

    const newColumn: Column = {
      ...columnData,
      id: generateId(),
      tasks: []
    };

    const updatedColumns = [...currentProject.columns, newColumn];
    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const updateColumn = (columnId: string, updates: Partial<Column>) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.map(column =>
      column.id === columnId ? { ...column, ...updates } : column
    );

    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const deleteColumn = (columnId: string) => {
    if (!currentProject) return;

    const updatedColumns = currentProject.columns.filter(column => column.id !== columnId);
    updateProject(currentProject.id, { columns: updatedColumns });
  };

  const reorderColumns = (columnIds: string[]) => {
    if (!currentProject) return;

    const columnMap = new Map(currentProject.columns.map(col => [col.id, col]));
    const reorderedColumns = columnIds.map((id, index) => ({
      ...columnMap.get(id)!,
      order: index
    }));

    updateProject(currentProject.id, { columns: reorderedColumns });
  };

  return (
    <KanbanContext.Provider value={{
      projects,
      projectTypes,
      currentProject,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTask,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns
    }}>
      {children}
    </KanbanContext.Provider>
  );
};
