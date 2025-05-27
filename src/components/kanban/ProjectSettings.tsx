
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKanban } from '@/contexts/KanbanContext';
import { Project, STATUS_COLORS } from '@/types/kanban';
import { Trash2, Edit2 } from 'lucide-react';

interface ProjectSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ isOpen, onClose, project }) => {
  const { updateProject, deleteProject, updateColumn, deleteColumn } = useKanban();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [columnTitle, setColumnTitle] = useState('');
  const [columnColor, setColumnColor] = useState('');

  const handleUpdateProject = () => {
    updateProject(project.id, {
      name: name.trim(),
      description: description.trim()
    });
  };

  const handleDeleteProject = () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      deleteProject(project.id);
      onClose();
    }
  };

  const startEditingColumn = (columnId: string, title: string, color: string) => {
    setEditingColumn(columnId);
    setColumnTitle(title);
    setColumnColor(color);
  };

  const saveColumnEdit = () => {
    if (editingColumn && columnTitle.trim()) {
      updateColumn(editingColumn, {
        title: columnTitle.trim(),
        color: columnColor
      });
      setEditingColumn(null);
      setColumnTitle('');
      setColumnColor('');
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta coluna? Todas as tarefas serão perdidas.')) {
      deleteColumn(columnId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Configurações do Projeto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações do Projeto</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Projeto
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                onBlur={handleUpdateProject}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                onBlur={handleUpdateProject}
                rows={3}
              />
            </div>
          </div>

          {/* Columns Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Colunas do Projeto</h3>
            
            <div className="space-y-3">
              {project.columns.sort((a, b) => a.order - b.order).map(column => (
                <div key={column.id} className="bg-gray-800/50 rounded-lg p-4">
                  {editingColumn === column.id ? (
                    <div className="space-y-3">
                      <Input
                        value={columnTitle}
                        onChange={(e) => setColumnTitle(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Nome da coluna"
                      />
                      
                      <div className="grid grid-cols-10 gap-2">
                        {STATUS_COLORS.map(color => (
                          <button
                            key={color.value}
                            onClick={() => setColumnColor(color.value)}
                            className={`w-8 h-8 rounded border-2 ${
                              columnColor === color.value ? 'border-white' : 'border-gray-600'
                            }`}
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={saveColumnEdit}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Salvar
                        </Button>
                        <Button
                          onClick={() => setEditingColumn(null)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        <span className="text-white font-medium">{column.title}</span>
                        <span className="text-gray-400 text-sm">
                          ({column.tasks.length} tarefas)
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startEditingColumn(column.id, column.title, column.color)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteColumn(column.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          disabled={project.columns.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h3>
            <Button
              onClick={handleDeleteProject}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Projeto
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
