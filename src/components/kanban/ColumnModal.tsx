
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKanban } from '@/contexts/KanbanContext';
import { STATUS_COLORS } from '@/types/kanban';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose }) => {
  const { createColumn, currentProject } = useKanban();
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(STATUS_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentProject) return;

    const maxOrder = Math.max(...currentProject.columns.map(col => col.order), -1);
    
    createColumn({
      title: title.trim(),
      color: selectedColor,
      order: maxOrder + 1
    });

    setTitle('');
    setSelectedColor(STATUS_COLORS[0].value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Coluna</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Coluna
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Em Revisão"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Cor da Coluna
            </label>
            <div className="grid grid-cols-5 gap-3">
              {STATUS_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-white scale-110'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
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
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Criar Coluna
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
