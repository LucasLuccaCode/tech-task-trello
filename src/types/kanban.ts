
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectType {
  id: string;
  name: string;
  icon: string;
  color: string;
  defaultColumns: Omit<Column, 'id' | 'tasks'>[];
}

export const DEFAULT_PROJECT_TYPES: ProjectType[] = [
  {
    id: 'estudos',
    name: 'Estudos',
    icon: 'book',
    color: '#3B82F6',
    defaultColumns: [
      { title: 'Para Estudar', color: '#EF4444', order: 0 },
      { title: 'Estudando', color: '#F59E0B', order: 1 },
      { title: 'Revisando', color: '#8B5CF6', order: 2 },
      { title: 'Concluído', color: '#10B981', order: 3 }
    ]
  },
  {
    id: 'programacao',
    name: 'Programação',
    icon: 'folder-kanban',
    color: '#8B5CF6',
    defaultColumns: [
      { title: 'Backlog', color: '#6B7280', order: 0 },
      { title: 'Todo', color: '#EF4444', order: 1 },
      { title: 'Em Progresso', color: '#F59E0B', order: 2 },
      { title: 'Review', color: '#3B82F6', order: 3 },
      { title: 'Concluído', color: '#10B981', order: 4 }
    ]
  },
  {
    id: 'leituras',
    name: 'Leituras',
    icon: 'book-open',
    color: '#10B981',
    defaultColumns: [
      { title: 'Lista de Leitura', color: '#6B7280', order: 0 },
      { title: 'Lendo', color: '#F59E0B', order: 1 },
      { title: 'Pausado', color: '#EF4444', order: 2 },
      { title: 'Finalizado', color: '#10B981', order: 3 }
    ]
  }
];

export const STATUS_COLORS = [
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Laranja', value: '#F59E0B' },
  { name: 'Amarelo', value: '#EAB308' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Roxo', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Cinza', value: '#6B7280' },
  { name: 'Slate', value: '#475569' }
];
