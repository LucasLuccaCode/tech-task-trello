
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKanban } from '@/contexts/KanbanContext';
import { ListTodo } from 'lucide-react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useKanban();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createProject(name.trim(), description.trim(), 'todo');
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-gray-900/95 border-gray-800 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center space-x-2">
            <ListTodo className="w-5 h-5 text-green-500" />
            <span>Nova Lista de Tarefas</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Lista
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tarefas Pessoais, Compras..."
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
              placeholder="Descreva o objetivo desta lista"
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={2}
            />
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
              disabled={!name.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Criar Lista
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
