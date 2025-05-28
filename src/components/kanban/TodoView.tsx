
import React, { useState } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { TaskModal } from './TaskModal';

export const TodoView: React.FC = () => {
  const { currentProject, setCurrentView, updateTask, deleteTask } = useKanban();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (!currentProject || currentProject.type.id !== 'todo') {
    return null;
  }

  const tasks = currentProject.columns[0]?.tasks || [];

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const handleAddQuickTask = () => {
    if (newTaskTitle.trim()) {
      setShowTaskModal(true);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

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

          <div className="flex items-center space-x-2 mt-4">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddQuickTask();
                }
              }}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
            />
            <Button
              onClick={handleAddQuickTask}
              disabled={!newTaskTitle.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Tarefas Pendentes */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Tarefas Pendentes ({incompleteTasks.length})
              </h2>
              <div className="space-y-2">
                {incompleteTasks.map(task => (
                  <div key={task.id} className="bg-gray-800/60 rounded-lg p-4 flex items-center space-x-3">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleToggleTask(task.id, true)}
                      className="border-gray-600 data-[state=checked]:bg-green-600"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {incompleteTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma tarefa pendente
                  </div>
                )}
              </div>
            </div>

            {/* Tarefas Concluídas */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Concluídas ({completedTasks.length})
                </h2>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <div key={task.id} className="bg-gray-800/30 rounded-lg p-4 flex items-center space-x-3 opacity-75">
                      <Checkbox
                        checked={true}
                        onCheckedChange={() => handleToggleTask(task.id, false)}
                        className="border-gray-600 data-[state=checked]:bg-green-600"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-300 font-medium line-through">{task.title}</h3>
                        {task.description && (
                          <p className="text-gray-500 text-sm mt-1 line-through">{task.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setNewTaskTitle('');
        }}
        columnId={currentProject.columns[0]?.id || ''}
        initialTitle={newTaskTitle}
      />
    </>
  );
};
