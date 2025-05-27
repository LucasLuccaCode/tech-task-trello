
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKanban } from '@/contexts/KanbanContext';
import { Book, BookOpen, FolderKanban } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const { projectTypes, createProject } = useKanban();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return <Book className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'book-open': return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'folder-kanban': return <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedType) {
      createProject(name.trim(), description.trim(), selectedType);
      setName('');
      setDescription('');
      setSelectedType('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-gray-900/95 border-gray-800 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Projeto
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do projeto"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu projeto"
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de Projeto
            </label>
            <div className="grid grid-cols-1 gap-2">
              {projectTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all touch-manipulation ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }`}
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${type.color}20`, color: type.color }}
                  >
                    {getIcon(type.icon)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm">{type.name}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      {type.defaultColumns.map(col => col.title).join(' → ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !selectedType}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Criar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
